import Round from "./Round";
import Team from "./Team";

export default class Application {

    private rounds:Array<Round>;
    private currentRound:Round;
    private currentRoundNum:number;
    private roundPoints:number;
    private roundAwarded:boolean;

    private team1:Team;
    private team2:Team;

    constructor() {
        this.rounds = [];

        this.team1 = new Team();
        this.team2 = new Team();

        fetch('data.json')
        .then(res => res.json())
        .then(data => this.init(data))
        .catch(err => console.error(err));
    }

    private init(data:any):void {
        data.rounds.forEach((item: { question: any }) => {
            this.rounds.push(new Round(item));
        });

        this.loadRound(0);

        document.addEventListener("keyup", (event) => this.onKeyUp(event));
    }

    private refresh():void {
        document.querySelector("#header .question .points").innerHTML = this.numberToString(this.roundPoints);
        document.getElementById("team1").innerText = this.numberToString(this.team1.getScore());
        document.getElementById("team2").innerText = this.numberToString(this.team2.getScore());
    }

    private loadRound(index:number):void {
        let round = this.rounds[index];
        this.currentRound = round;
        this.currentRoundNum = index;
        this.roundPoints = 0;
        this.roundAwarded = false;

        document.querySelector("#header .question .text").innerHTML = round.getQuestion();

        for (var i = 0; i < 8; i++) {
            let answer = round.getAnswer(i);

            (<HTMLElement> document.querySelector(`#content .answer:nth-child(${i + 1})`)).classList.remove("reveal");

            if (answer) {
                document.querySelector(`#content .answer:nth-child(${i + 1}) .text`).innerHTML = answer.text;
                document.querySelector(`#content .answer:nth-child(${i + 1}) .total`).innerHTML = "" + answer.total;
                document.querySelector(`#content .answer:nth-child(${i + 1})`).classList.remove("hidden");
            }
            else {
                document.querySelector(`#content .answer:nth-child(${i + 1})`).classList.add("hidden");
            }
        }
    }

    private onKeyUp(event:KeyboardEvent):void {
        console.log(event.code);

        if (event.code === "Digit1") this.revealAnswer(1);
        else if (event.code === "Digit2") this.revealAnswer(2);
        else if (event.code === "Digit3") this.revealAnswer(3);
        else if (event.code === "Digit4") this.revealAnswer(4);
        else if (event.code === "Digit5") this.revealAnswer(5);
        else if (event.code === "Digit6") this.revealAnswer(6);
        else if (event.code === "Digit7") this.revealAnswer(7);
        else if (event.code === "Digit8") this.revealAnswer(8);

        if (event.code === "KeyO") this.awardRound(this.team1);
        else if (event.code === "KeyP") this.awardRound(this.team2);

        if (event.code === "ArrowRight") this.nextRound();
        else if (event.code === "ArrowLeft") this.prevRound();

        this.refresh();
    }

    private nextRound():void {
        this.loadRound(this.currentRoundNum + 1);
    }

    private prevRound():void {
        if (this.currentRoundNum === 0) return;

        this.loadRound(this.currentRoundNum - 1);
    }

    private awardRound(winners:Team):void {
        if (this.roundAwarded) return;

        winners.addPoints(this.roundPoints);
        this.roundAwarded = true;
    }

    private revealAnswer(num:number):void {
        if (num > this.currentRound.getNumAnswers()) return;

        this.roundPoints += this.currentRound.getAnswer(num - 1).total;

        (<HTMLElement> document.querySelector(`#content .answer:nth-child(${num})`)).classList.add("reveal");
    }

    private numberToString(num:number):string {
        return (num < 10 ? "0" : "") + num;
    }
}