export default function SponsorMarquee() {
  return (
    <div className="border-t border-[var(--border)] bg-[var(--card)] py-5 overflow-hidden">
      <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest text-center mb-4">
        Made possible by
      </p>
      <div className="overflow-hidden">
        <div className="flex animate-marquee gap-16 items-center" style={{ width: 'max-content' }}>
          {[
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780394708/nouzoos_bnqatr.png',
              w: 'w-[129px]',
              h: 'h-[41px]',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780394730/Logo_Diap_RGB_Totaalwarmte_ybdfbz.png',
              w: 'w-28',
              h: 'h-9',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780394738/BatKingEurope_Logo_rgb_white_w30lxp.webp',
              w: 'w-28',
              h: 'h-9',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780395350/SSK_LOGO_nnm9t2.png',
              w: 'w-28',
              h: 'h-9',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780395308/LJ_hpdo4v.png',
              w: 'w-28',
              h: 'h-9',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780395334/GizzoMedia_Logo_nedyfo.png',
              w: 'w-[134px]',
              h: 'h-[43px]',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/e_trim/v1791289300/MADERA_SOFTWARE_bnriol.png',
              w: 'w-[126px]',
              h: 'h-[40px]',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780395321/KNBSB_etffww.png',
              w: 'w-[168px]',
              h: 'h-[54px]',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780394708/nouzoos_bnqatr.png',
              w: 'w-[129px]',
              h: 'h-[41px]',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780394730/Logo_Diap_RGB_Totaalwarmte_ybdfbz.png',
              w: 'w-28',
              h: 'h-9',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780394738/BatKingEurope_Logo_rgb_white_w30lxp.webp',
              w: 'w-28',
              h: 'h-9',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780395350/SSK_LOGO_nnm9t2.png',
              w: 'w-28',
              h: 'h-9',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780395308/LJ_hpdo4v.png',
              w: 'w-28',
              h: 'h-9',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780395334/GizzoMedia_Logo_nedyfo.png',
              w: 'w-[134px]',
              h: 'h-[43px]',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/e_trim/v1791289300/MADERA_SOFTWARE_bnriol.png',
              w: 'w-[126px]',
              h: 'h-[40px]',
            },
            {
              src: 'https://res.cloudinary.com/dn8c5398m/image/upload/v1780395321/KNBSB_etffww.png',
              w: 'w-[168px]',
              h: 'h-[54px]',
            },
          ].map(({ src, w, h }, i) => (
            <div key={i} className={`${w} ${h} flex items-center justify-center shrink-0`}>
              <img
                src={src}
                alt="sponsor"
                className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
