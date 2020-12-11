export default class Team {

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