import {Howl, Howler} from 'howler';

export default class SoundManager {

    private static correctSound:Howl;
    private static wrongSound:Howl;
    private static pingSound:Howl;
    private static themeMusic:Howl;
    private static crowdSounds:Array<Howl>;
    private static lastCrowdSound:number;

    public static init():void {
        this.correctSound = new Howl({
            src: ['sounds/correct.wav']
        });

        this.wrongSound = new Howl({
            src: ['sounds/wrong.wav'],
            volume: 0.6
        });

        this.pingSound = new Howl({
            src: ['sounds/ping.wav']
        });

        this.themeMusic = new Howl({
            src: ['sounds/theme.mp3']
        });

        this.crowdSounds = [];
        for (var i = 1; i <= 7; i++) {
            this.crowdSounds.push(new Howl({
                src: ['sounds/crowd' + i + '.wav']
            }));
        }
    }

    public static playTheme():void {
        this.themeMusic.play();
    }

    public static stopTheme():void {
        this.themeMusic.fade(1, 0, 4000);
    }

    public static playCorrectSound():void {
        this.correctSound.play();
    }

    public static playWrongSound():void {
        this.wrongSound.play();
    }

    public static playPingSound():void {
        this.pingSound.play();
    }

    public static playCrowdSound():void {
        let index = Math.floor(Math.random() * this.crowdSounds.length);
        while (this.lastCrowdSound && index === this.lastCrowdSound)
            index = Math.floor(Math.random() * this.crowdSounds.length);
        this.crowdSounds[index].play();
    }
}