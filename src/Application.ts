import Round from "./Round";

export default class Application {

    private rounds:Array<Round>;

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
    }

    private loadRound(index:number):void {
        let round = this.rounds[index];

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
}