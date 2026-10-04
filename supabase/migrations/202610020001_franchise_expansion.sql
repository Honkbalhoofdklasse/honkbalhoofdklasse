-- Accept legacy seven-club careers and the explicit eighth-club expansion.
-- Authentication, ownership, raw TEXT storage and revision CAS are unchanged.
begin;
create or replace function public.save_franchise_career(p_slot integer,p_payload text,p_expected_revision integer,p_engine_version text,p_format_version integer)
returns integer language plpgsql security definer set search_path = '' as $$
declare new_revision integer; caller uuid := auth.uid(); parsed jsonb;
begin
  if caller is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_slot not between 1 and 3 or p_expected_revision < 0 or p_engine_version <> '0.6.1' or p_format_version <> 1 or octet_length(p_payload) > 16000000 then raise exception 'Invalid save'; end if;
  parsed := p_payload::jsonb;
  if jsonb_typeof(parsed) <> 'object' or (parsed->>'slot')::integer is distinct from p_slot or jsonb_typeof(parsed->'players') is distinct from 'array' or jsonb_typeof(parsed->'clubs') is distinct from 'array' then raise exception 'Invalid career'; end if;
  if (
    (jsonb_array_length(parsed->'clubs') = 7 and coalesce(parsed->'customClub', 'null'::jsonb) = 'null'::jsonb and (parsed->>'user')::integer between 0 and 6)
    or (jsonb_array_length(parsed->'clubs') = 8 and jsonb_typeof(parsed->'customClub') = 'object' and (parsed->>'user')::integer = 7 and (parsed->>'draft')::boolean = false
      and char_length(parsed->'customClub'->>'name') between 1 and 28
      and char_length(parsed->'customClub'->>'city') between 1 and 24
      and char_length(parsed->'customClub'->>'abbr') between 2 and 4
      and (parsed->'customClub'->>'color') ~ '^[0-9a-fA-F]{6}$'
      and (parsed->'customClub'->>'secondary') ~ '^[0-9a-fA-F]{6}$'
      and (parsed->'customClub'->>'badge')::integer between 0 and 2)
  ) is not true then raise exception 'Invalid club configuration'; end if;
  if p_expected_revision = 0 then
    insert into public.franchise_saves(user_id,slot,payload,engine_version,format_version)
      values(caller,p_slot,p_payload,p_engine_version,p_format_version)
      on conflict (user_id,slot) do nothing returning revision into new_revision;
  else
    update public.franchise_saves set payload=p_payload,revision=revision+1,updated_at=now(),engine_version=p_engine_version,format_version=p_format_version
      where user_id=caller and slot=p_slot and revision=p_expected_revision returning revision into new_revision;
  end if;
  return new_revision; -- NULL means conflict; never silently replace a newer save.
end $$;
commit;
