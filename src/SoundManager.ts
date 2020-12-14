import {Howl, Howler} from 'howler';

export default class SoundManager {

    private static correctSound:Howl;
    private static wrongSound:Howl;

    public static init():void {
        this.correctSound = new Howl({
            src: ['sounds/correct.wav']
        });

        this.wrongSound = new Howl({
            src: ['sounds/wrong.wav']
        });
    }

    public static playCorrectSound():void {
        this.correctSound.play();
    }

    public static playWrongSound():void {
        this.wrongSound.play();
    }
}