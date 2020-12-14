import {Howl, Howler} from 'howler';

export default class SoundManager {

    private static correctSound:Howl;

    public static init():void {
        this.correctSound = new Howl({
            src: ['sounds/correct.wav']
        });
    }

    public static playCorrectSound():void {
        this.correctSound.play();
    }
}