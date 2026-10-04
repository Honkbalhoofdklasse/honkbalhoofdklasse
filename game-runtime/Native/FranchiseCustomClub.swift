import Foundation

struct CustomClub:Codable {
    var name="New Holland",abbr="NHC",city="Utrecht",color="32B5AC",secondary="F8F5EB",badge=0
    var valid:Bool {
        func clean(_ s:String,_ max:Int)->Bool{!s.trimmingCharacters(in:.whitespacesAndNewlines).isEmpty && s.count<=max && !s.unicodeScalars.contains{CharacterSet.controlCharacters.contains($0)} && !s.contains("|")}
        return clean(name,28) && clean(city,24) && clean(abbr,4) && abbr.count>=2 && [color,secondary].allSatisfy{$0.count==6 && UInt32($0,radix:16) != nil} && (0...2).contains(badge)
    }
    func team(_ db:Database)->Team {
        Team(id:"custom-club",name:name,sourceName:name,abbr:abbr,color:color,city:city,logo:"custom|\(color)|\(secondary)|\(abbr)|\(badge)",photos:db.teams.flatMap{$0.photos})
    }
}
extension Franchise {
    var clubCount:Int{clubs.count}
    func teamCatalog(_ db:Database)->[Team]{db.teams+(customClub.map{[$0.team(db)]} ?? [])}
    static func makeCustom(db:Database,design:CustomClub,slot:Int,seed:UInt64)->Franchise? {
        guard design.valid else{return nil}
        var f=make(db:db,user:0,slot:slot,fantasy:false,seed:seed)
        f.customClub=design;f.user=7;f.clubs.append(FranchiseClub());f.clubs[7].fans=700
        let given=["Daan","Ruben","Jayden","Lucas","Jules","Ryan","Levi","Sandro","Thijs","Rico","Owen","Mats","Dean","Julian"]
        let surnames=["Van Dijk","De Wit","Visser","Pieters","Bos","Croes","Lammers"]
        var names=given.flatMap{first in surnames.map{first+" "+$0}}
        let positions=Array(repeating:"P",count:10)+["C","C","1B","2B","3B","SS","LF","CF","RF","1B","2B","3B","SS","LF","CF","P","C","CF"]
        for n in positions.indices {
            let pos=positions[n],farm=n>=25,age=farm ? 18+Int(f.random()*3):21+Int(f.random()*13)
            let name=names.remove(at:Int(f.random()*Double(names.count)))
            let profile=Player(id:"expansion-2026-\(n)",teamID:"custom-club",name:name,position:pos,number:String(n+1),bats:f.random()<0.28 ? "L":"R",throws:n<10 && n%4==0 ? "L":"R",sourceID:nil,birthYear:2026-age,ovr:nil,stats:nil,positions:pos=="P" ? ["P"]:[pos,"DH"],positionCoverage:"Fictional expansion player")
            var skills=(0..<12).map{_ in (farm ? 37.0:40.0)+f.random()*12}
            for a in pos=="P" ? [5,6,7]:[0,2,4]{skills[a]+=n==0 || n==12 ? 8:2}
            let ceilings=skills.map{min(82,$0+(farm ? 18:9)+f.random()*7)}
            var p=FranchisePlayer(profile:profile,club:7)
            p.youth=YouthOrigin(year:2026,skills:skills,ceilings:ceilings,region:design.city,kind:"expansion");p.farm=farm
            if farm{p.farmProgress=FarmProgress(focus:pos=="P" ? 5:0)}
            f.players.append(p);f.clubs[7].roster.append(profile.id)
        }
        f.autoLineup(7);f.makeSchedule();f.boardPlan=nil;f.academyIntake=nil;f.sponsorMarket=nil
        f.inbox=[];f.prepareFranchiseYear();f.refreshSponsorMarket();f.recordDevelopment()
        f.log("WELCOME TO \(design.name.uppercased()). You are the eighth club: 25 active players, three farm prospects, €180,000 and 700 supporters. Every player in your starting squad is fictional.")
        f.log("EXPANSION FORMAT: 42 regular-season games per club on an adapted calendar. Top four: best-of-five semifinals, then a best-of-seven Holland Series. Clubs 5–8 play a placement round.")
        return f
    }
}
