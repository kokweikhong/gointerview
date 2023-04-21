export namespace backend {
	
	export class Score {
	    education: number;
	    technical: number;
	    workExperience: number;
	    supervisory: number;
	    teamwork: number;
	    alertness: number;
	    maturity: number;
	    growth: number;
	
	    static createFrom(source: any = {}) {
	        return new Score(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.education = source["education"];
	        this.technical = source["technical"];
	        this.workExperience = source["workExperience"];
	        this.supervisory = source["supervisory"];
	        this.teamwork = source["teamwork"];
	        this.alertness = source["alertness"];
	        this.maturity = source["maturity"];
	        this.growth = source["growth"];
	    }
	}
	export class Candidate {
	    id: number;
	    date: string;
	    name: string;
	    position: string;
	    nationality: string;
	    race: string;
	    gender: string;
	    age: number;
	    qualification: string;
	    remarks: string;
	    decision: string;
	    comments: string;
	    overall: number;
	    scores?: Score;
	
	    static createFrom(source: any = {}) {
	        return new Candidate(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.date = source["date"];
	        this.name = source["name"];
	        this.position = source["position"];
	        this.nationality = source["nationality"];
	        this.race = source["race"];
	        this.gender = source["gender"];
	        this.age = source["age"];
	        this.qualification = source["qualification"];
	        this.remarks = source["remarks"];
	        this.decision = source["decision"];
	        this.comments = source["comments"];
	        this.overall = source["overall"];
	        this.scores = this.convertValues(source["scores"], Score);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

