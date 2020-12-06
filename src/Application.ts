import Round from "./Round";

export default class Application {

    private rounds:Array<Round>;
    private currentRound:Round;

    constructor() {
        this.rounds = [];

        fetch('data.json')
        .then(res => res.json())
        .then(data => this.init(data))
        .catch(err => console.error(err));
    }

    private init(data:any):void {
        data.rounds.forEach((item: { question: any; }) => {
            this.rounds.push(new Round(item));
        });

        this.loadRound(0);

        document.addEventListener("keyup", (event) => this.onKeyUp(event));
    }

    private loadRound(index:number):void {
        let round = this.rounds[index];
        this.currentRound = round;

        document.querySelector("#header .question").innerHTML = round.getQuestion();

        for (var i = 0; i < 8; i++) {
            let answer = round.getAnswer(i);

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
    }

    private revealAnswer(num:number):void {
        if (num > this.currentRound.getNumAnswers()) return;

        (<HTMLElement> document.querySelector(`#content .answer:nth-child(${num}) .number`)).style.display = "none";
        (<HTMLElement> document.querySelector(`#content .answer:nth-child(${num}) .result`)).style.display = "flex";
    }
}