import {Howl, Howler} from 'howler';

export default class SoundManager {

    private static correctSound:Howl;
    private static wrongSound:Howl;
    private static pingSound:Howl;
    private static themeMusic:Howl;

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
}