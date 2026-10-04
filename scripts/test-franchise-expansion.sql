-- Disposable transaction only: no real accounts or careers are read or modified.
begin;
do $$
declare a uuid:=gen_random_uuid(); b uuid:=gen_random_uuid(); rev integer; raw text;
  legacy text:='{"slot":1,"user":0,"players":[{}],"clubs":[{},{},{},{},{},{},{}],"rng":18446744073709551615}';
  expansion text:='{"slot":1,"user":7,"draft":false,"players":[{}],"clubs":[{},{},{},{},{},{},{},{}],"rng":18446744073709551615,"customClub":{"name":"Test Club","city":"Utrecht","abbr":"TST","color":"32B5AC","secondary":"F8F5EB","badge":1}}';
begin
  insert into auth.users(id,email) values(a,a::text||'@example.invalid'),(b,b::text||'@example.invalid');
  perform set_config('request.jwt.claims',json_build_object('sub',a,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  rev:=public.save_franchise_career(1,legacy,0,'0.6.1',1);
  if rev is distinct from 1 then raise exception 'Legacy create failed'; end if;
  rev:=public.save_franchise_career(1,expansion,1,'0.6.1',1);
  if rev is distinct from 2 then raise exception 'Expansion update failed'; end if;
  select payload into raw from public.franchise_saves where user_id=a and slot=1;
  if raw is distinct from expansion then raise exception 'Raw payload changed'; end if;
  if public.save_franchise_career(1,legacy,1,'0.6.1',1) is not null then raise exception 'Stale revision accepted'; end if;
  begin
    perform public.save_franchise_career(1,replace(expansion,'"badge":1','"badge":9'),2,'0.6.1',1);
    raise exception 'BAD_ACCEPTED';
  exception when raise_exception then if sqlerrm='BAD_ACCEPTED' then raise; end if; end;
  perform set_config('request.jwt.claims',json_build_object('sub',b,'role','authenticated')::text,true);
  if exists(select 1 from public.franchise_saves where user_id=a) then raise exception 'Cross-account read'; end if;
  if public.save_franchise_career(1,legacy,2,'0.6.1',1) is not null then raise exception 'Cross-account overwrite'; end if;
  execute 'reset role';
end $$;
rollback;
select 'PASS: seven/eight clubs, exact UInt64 payload, stale revision, invalid badge and account isolation; all test rows rolled back' as result;
