export default class Round {

    private question:string;
    private answers:Array<{ text:string, total:number }>;

    constructor(data:any) {
        this.question = data.question;
        this.answers = data.answers;
    }

    public getQuestion():string {
        return this.question;
    }

    public getAnswer(index:number):{ text:string, total:number } {
        if (index >= this.answers.length)
            return null;
        return this.answers[index];
    }

    public getNumAnswers():number {
        return this.answers.length;
    }
}