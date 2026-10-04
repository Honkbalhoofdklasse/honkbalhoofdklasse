import AppKit
import Foundation

extension FranchiseView {
    var clubTextField:String?{page=="customclub" && modal.hasPrefix("clubtext:") ? String(modal.dropFirst(9)):nil}
    var clubTextValue:String{switch clubTextField{case "name":return clubDesign.name;case "city":return clubDesign.city;default:return clubDesign.abbr}}
    var clubTextLimit:Int{clubTextField=="name" ? 28:clubTextField=="city" ? 24:4}
    func setClubText(_ input:String){
        guard let field=clubTextField else{return}
        let clean=String(input.unicodeScalars.filter{!CharacterSet.controlCharacters.contains($0) && $0 != "|"}.map(String.init).joined().trimmingCharacters(in:.whitespacesAndNewlines).prefix(clubTextLimit))
        if field=="name"{clubDesign.name=clean}else if field=="city"{clubDesign.city=clean}else{clubDesign.abbr=clean.uppercased()}
        modal="";needsDisplay=true
    }
    func customBadge(_ path:String,_ r:NSRect){
        let parts=path.components(separatedBy:"|");guard parts.count==5 else{return}
        let color=NSColor(hex:parts[1]),trim=NSColor(hex:parts[2]),style=Int(parts[4]) ?? 0
        let size=min(r.width,r.height),x=r.midX-size/2,y=r.midY-size/2
        let outline=NSBezierPath()
        if style==2 {let oval=NSBezierPath(ovalIn:rect(x+size*0.06,y+size*0.06,size*0.88,size*0.88));color.setFill();oval.fill();trim.setStroke();oval.lineWidth=max(1,size*0.035);oval.stroke()}
        else {
            let points:[(CGFloat,CGFloat)]=style==0 ? [(0.12,0.12),(0.88,0.12),(0.85,0.65),(0.5,0.95),(0.15,0.65)]:[(0.5,0.04),(0.97,0.5),(0.5,0.96),(0.03,0.5)]
            for (i,p) in points.enumerated(){let q=NSPoint(x:x+p.0*size,y:y+p.1*size);if i==0{outline.move(to:q)}else{outline.line(to:q)}};outline.close();color.setFill();outline.fill();trim.setStroke();outline.lineWidth=max(1,size*0.035);outline.stroke()
        }
        let line=NSBezierPath();line.move(to:.init(x:x+size*0.29,y:y+size*0.72));line.line(to:.init(x:x+size*0.71,y:y+size*0.72));line.lineWidth=max(1,size*0.02);trim.setStroke();line.stroke()
        text(parts[3],x+size*0.16,y+size*0.31,size*(parts[3].count>3 ? 0.25:0.30),trim,"Impact",size*0.70)
    }
    func drawCustomClub(){
        heading("FRANCHISE / CREATE YOUR CLUB");text("YOUR CLUB. YOUR IDENTITY.",51,119,62,white,"Impact",1460)
        let design=clubDesign.team(db)
        panel(rect(51,228,520,543));customBadge(design.logo,rect(168,271,285,245))
        text(clubDesign.name.isEmpty ? "YOUR CLUB":clubDesign.name.uppercased(),78,542,38,white,"Impact",463)
        text(clubDesign.city.uppercased()+"  /  EIGHTH CLUB",80,601,21,NSColor(hex:clubDesign.color),"AvenirNext-DemiBold",464)
        paragraph("An expansion career with a fictional squad. Build your own identity alongside all seven Hoofdklasse clubs.",80,650,459,89,23,muted)
        button("CLUB NAME: "+clubDesign.name,"clubedit:name",rect(609,230,936,59))
        button("HOME CITY: "+clubDesign.city,"clubedit:city",rect(609,303,566,59));button("ABBR: "+clubDesign.abbr,"clubedit:abbr",rect(1192,303,353,59))
        text("PRIMARY COLOUR",612,385,20,muted,"AvenirNext-DemiBold",890)
        for (n,hex) in customClubColors.enumerated(){let x:CGFloat=609+CGFloat(n)*78,r=rect(x,423,65,47);fill(r,NSColor(hex:hex));if clubDesign.color==hex{let p=NSBezierPath(rect:r.insetBy(dx:-3,dy:-3));p.lineWidth=2;white.setStroke();p.stroke()};hit("clubcolor:\(n)","Primary colour "+customClubColorNames[n],r)}
        text("EMBLEM & TRIM",612,492,20,muted,"AvenirNext-DemiBold",890)
        for n in 0..<3{button(["SHIELD","DIAMOND","ROUND"][n],"clubbadge:\(n)",rect(609+CGFloat(n)*219,530,203,45),primary:clubDesign.badge==n)}
        button(clubDesign.secondary=="F8F5EB" ? "WHITE TRIM":"NAVY TRIM","clubtrim",rect(1266,530,278,45))
        paragraph("25 active players + 3 farm prospects · €180,000 budget · 700 fans\n42 games per club · Top-four playoffs · Best-of-seven Holland Series",612,611,914,86,24,white)
        text("Fictional roster and adapted calendar. Existing careers stay unchanged.",612,709,19,muted,"AvenirNext-DemiBold",913)
        button("BACK","clubback",rect(51,789,250,44))
        button("FOUND CLUB & START CAREER →","clubcreate",rect(1010,763,534,65),primary:true,enabled:clubDesign.valid)
        footer()
    }
    func customClubModal()->Bool {
        guard let field=clubTextField else{return false}
        text("EDIT "+field.uppercased(),114,121,45,white,"Impact",1290)
        paragraph("Type your "+field+" and press Enter to confirm. Escape cancels.",116,215,1300,80,25,white)
        text(clubTextDraft+"_",118,350,55,accent,"Impact",1300)
        button("CANCEL","clubtextcancel",rect(114,752,280,49));button("CONFIRM","clubtextconfirm",rect(1040,752,439,49),primary:true)
        return true
    }
    func customTextKey(_ code:Int,_ chars:String)->Bool {
        guard clubTextField != nil else{return false}
        if code==53{modal=""}else if code==36{setClubText(clubTextDraft)}else if code==51{if !clubTextDraft.isEmpty{clubTextDraft.removeLast()}}else if chars.count==1 && clubTextDraft.count<clubTextLimit{clubTextDraft+=chars}
        needsDisplay=true;return true
    }
    func customClubAction(_ action:String)->Bool {
        if action=="newcustomclub"{page="customclub";modal="";focus=0;return true}
        guard page=="customclub" else{return false}
        if action.hasPrefix("clubedit:"){let field=String(action.dropFirst(9));guard ["name","city","abbr"].contains(field) else{return false};modal="clubtext:"+field;clubTextDraft=clubTextValue;return true}
        if action.hasPrefix("clubcolor:"),let i=Int(action.dropFirst(10)),customClubColors.indices.contains(i){clubDesign.color=customClubColors[i];return true}
        if action.hasPrefix("clubbadge:"),let i=Int(action.dropFirst(10)),(0...2).contains(i){clubDesign.badge=i;return true}
        switch action {
        case "clubtrim":clubDesign.secondary=clubDesign.secondary=="F8F5EB" ? "07131C":"F8F5EB"
        case "clubback":page="setup";focus=0
        case "clubtextcancel":modal=""
        case "clubtextconfirm":setClubText(clubTextDraft)
        case "clubcreate":
            guard let f=Franchise.makeCustom(db:db,design:clubDesign,slot:newSlot,seed:UInt64(Date().timeIntervalSince1970)),f.validate() else{notify("Check your club name, city and 2–4 character abbreviation.");return true}
            career=f;career?.prepareWorld();page="hub";tab=0;rosterPage=0;poolPage=0;selectedDay=0;modal="";syncMonth();save();focus=0;beginCareerTour(automatic:true)
        default:return false
        };return true
    }
}
let customClubColors=["32B5AC","EE7E1A","598CC9","D45C68","D5B44D","9A80C4","6FAE73","D47945","93B8C9","D278A8","C2CECE","6F8293"]
let customClubColorNames=["Teal","Orange","Blue","Red","Gold","Purple","Green","Copper","Ice blue","Pink","Silver","Slate"]
