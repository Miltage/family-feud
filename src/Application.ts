import { gsap } from "gsap";
import Confetti from "./Confetti";
import Round from "./Round";
import SoundManager from "./SoundManager";
import Team from "./Team";

export default class Application {

    public transitionSpeed:number = 0.6;

    private rounds:Array<Round>;
    private currentRound:Round;
    private currentRoundNum:number;
    private roundPoints:number;
    private roundAwarded:boolean;
    private started:boolean;
    private ended:boolean;

    private team1:Team;
    private team2:Team;

    constructor() {
        this.rounds = [];

        this.team1 = new Team();
        this.team2 = new Team();
        this.team1.name = "team1";
        this.team2.name = "team2";
        this.started = false;
        this.ended = false;

        fetch('data.json')
        .then(res => res.json())
        .then(data => this.init(data))
        .catch(err => console.error(err));
    }

    private init(data:any):void {
        data.rounds.forEach((item: { question: any }) => {
            this.rounds.push(new Round(item));
        });

        this.currentRoundNum = -1;

        document.addEventListener("keyup", (event) => this.onKeyUp(event));

        gsap.set("#title img", { scale: 0 });
        gsap.to("#title img", {
            duration: 10,
            scale: 1,
            ease: "elastic",
            onComplete: () => {
                gsap.to("#title img", {
                    duration: 3,
                    scale: 1.2,
                    repeat: 100,
                    yoyo: true,
                    ease: "power3.inOut"
                });
            }
        });

        SoundManager.playTheme();
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

        this.refresh();
        gsap.set(".strikes", { scale: 0, opacity: 1 });
        document.querySelector(".strikes").innerHTML = "";
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
        else if (event.code === "KeyX") this.showStrike();

        if (event.code === "ArrowRight") this.nextRound();
        else if (event.code === "ArrowLeft") this.prevRound();

        if (event.code === "KeyC") SoundManager.playCrowdSound();

        this.refresh();
    }

    private transition(cb:() => void):void {
        if (!this.started) {
            gsap.to("#title", {
                duration: this.transitionSpeed * 2,
                opacity: 0,
                ease: "expo.out",
                onComplete: () => {
                    document.getElementById("title").style.display = "none";
                    this.transition(cb);
                }
            });
            SoundManager.stopTheme();
            this.started = true;
            return;
        }
        else if (this.ended) {
            gsap.to("#wrapper", {
                duration: this.transitionSpeed,
                opacity: 0,
                scale: 0.9,
                ease: "expo.out",
                onComplete: () => {
                    this.showEnd();
                    document.getElementById("end").style.display = "flex";
                    document.getElementById("wrapper").style.display = "none";
                    gsap.to("#end", {
                        duration: this.transitionSpeed,
                        opacity: 1,
                        scale: 1,
                        ease: "expo.out"
                    });
                }
            });
            return;
        }

        gsap.to("#wrapper", {
            duration: this.transitionSpeed,
            opacity: 0,
            scale: 0.9,
            ease: "expo.out",
            onComplete: () => {
                cb();
                SoundManager.playChimeSound();
                document.getElementById("wrapper").style.display = "grid";
                gsap.to("#wrapper", {
                    duration: this.transitionSpeed,
                    opacity: 1,
                    scale: 1,
                    ease: "expo.out"
                });
            }
        });
    }

    private nextRound():void {
        if (this.currentRoundNum + 1 >= this.rounds.length)
            this.ended = true;
        this.transition(() => this.loadRound(this.currentRoundNum + 1));
    }

    private prevRound():void {
        if (this.currentRoundNum === 0) return;

        this.transition(() => this.loadRound(this.currentRoundNum - 1));
    }

    private showEnd():void {
        let winningScore = 0;

        if (this.team1.getScore() > this.team2.getScore())
            winningScore = this.team1.getScore();
        else
            winningScore = this.team2.getScore();

        document.getElementById("end").style.display = "flex";
        document.querySelector("#end span.score").innerHTML = "" + winningScore;
        gsap.set("#end", { opacity: 0 });
        gsap.to("#end", {
            opacity: 1,
            duration: 1
        });

        gsap.to("#end span.score", {
            duration: 0.6,
            scale: 1.2,
            repeat: 100,
            yoyo: true,
            ease: "power3.inOut"
        });

        gsap.fromTo("#end span.score", { rotation: -10 }, {
            duration: 1.2,
            rotation: 10,
            repeat: 100,
            yoyo: true,
            ease: "expo.inOut"
        });

        Confetti.startConfetti();
        SoundManager.playTheme();
        SoundManager.playApplauseSound();
    }

    private awardRound(winners:Team):void {
        if (this.roundAwarded || this.roundPoints == 0) return;

        winners.addPoints(this.roundPoints);
        this.roundAwarded = true;
        SoundManager.playPingSound();

        gsap.set("#" + winners.name, { scale: 1 });
        gsap.timeline().to("#" + winners.name, {
            duration: 0.3,
            scale: 1.4,
            ease: "expo.out"
        })
        .to("#" + winners.name, {
            duration: 0.3,
            scale: 1,
            ease: "expo.out"
        });
    }

    private revealAnswer(num:number):void {
        if (num > this.currentRound.getNumAnswers()) return;

        if ((<HTMLElement> document.querySelector(`#content .answer:nth-child(${num})`)).classList.contains("reveal"))
            return;

        this.roundPoints += this.currentRound.getAnswer(num - 1).total;
        SoundManager.playCorrectSound();

        gsap.set(".points", { scale: 1 });
        gsap.timeline().to(".points", {
            duration: 0.3,
            scale: 1.4,
            ease: "expo.out"
        })
        .to(".points", {
            duration: 0.3,
            scale: 1,
            ease: "expo.out"
        });

        (<HTMLElement> document.querySelector(`#content .answer:nth-child(${num})`)).classList.add("reveal");
    }

    private numberToString(num:number):string {
        return (num < 10 ? "0" : "") + num;
    }

    private strikeTween:any;
    private showStrike():void {
        let strikeContainer = document.querySelector(".strikes");

        if (strikeContainer.children.length === 3)
            strikeContainer.innerHTML = "";
        
        if (this.strikeTween) this.strikeTween.kill();

        let strike = document.createElement("img");
        strike.setAttribute("src", "images/incorrect.png");
        strikeContainer.appendChild(strike);

        this.strikeTween = gsap.timeline();

        gsap.set(strikeContainer, { scale: 0, opacity: 1 });
        this.strikeTween.to(strikeContainer, {
            duration: 0.6,
            scale: 1,
            ease: "expo.out"
        })
        .to(strikeContainer, {
            delay: 2,
            duration: 1,
            scale: 0,
            opacity: 0,
            ease: "expo.out"
        });

        SoundManager.playWrongSound();
    }
}