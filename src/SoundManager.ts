import {Howl, Howler} from 'howler';

export default class SoundManager {

    private static correctSound:Howl;
    private static wrongSound:Howl;
    private static pingSound:Howl;
    private static themeMusic:Howl;
    private static applauseSound:Howl;
    private static chimeSound:Howl;
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

        this.applauseSound = new Howl({
            src: ['sounds/applause.wav']
        });

        this.chimeSound = new Howl({
            src: ['sounds/chime.wav']
        });
    }

    public static playTheme():void {
        this.themeMusic.stop();
        this.themeMusic.play();
        this.themeMusic.fade(0, 1, 2000);
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

    public static playApplauseSound():void {
        this.applauseSound.play();
        this.applauseSound.fade(0, 0.4, 2000);
    }

    public static playChimeSound():void {
        this.chimeSound.play();
    }
}