export default class Team {

    public name:string;

    private score:number;

    constructor() {
        this.score = 0;
    }

    public getScore():number {
        return this.score;
    }

    public addPoints(points:number):void {
        this.score += points;
    }
    
}