export default class Confetti {

    private static confetti = {
        maxCount: 150,		//set max confetti count
        speed: -2,			//set the particle animation speed
        frameInterval: 15,	//the confetti animation frame interval in milliseconds
        alpha: 1.0,			//the alpha opacity of the confetti (between 0 and 1, where 1 is opaque and 0 is invisible)
        gradient: false	//whether to use gradients for the confetti particles
    };

    private static supportsAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
	private static colors = ["rgba(30,144,255,", "rgba(107,142,35,", "rgba(255,215,0,", "rgba(255,192,203,", "rgba(106,90,205,", "rgba(173,216,230,", "rgba(238,130,238,", "rgba(152,251,152,", "rgba(70,130,180,", "rgba(244,164,96,", "rgba(210,105,30,", "rgba(220,20,60,"];
	private static streamingConfetti = false;
	private static animationTimer:number = null;
	private static pause:boolean = false;
	private static lastFrameTime = Date.now();
	private static particles:Array<any> = [];
	private static waveAngle = 0;
	private static context:CanvasRenderingContext2D = null;

	private static resetParticle(particle:any, width:number, height:number) {
		particle.color = this.colors[(Math.random() * this.colors.length) | 0] + (this.confetti.alpha + ")");
		particle.color2 = this.colors[(Math.random() * this.colors.length) | 0] + (this.confetti.alpha + ")");
		particle.x = Math.random() * width;
		particle.y = Math.random() * height - height;
		particle.diameter = Math.random() * 10 + 5;
		particle.tilt = Math.random() * 10 - 10;
		particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
		particle.tiltAngle = Math.random() * Math.PI;
		return particle;
	}

	private static toggleConfettiPause() {
		if (this.pause)
			this.resumeConfetti();
		else
			this.pauseConfetti();
	}

	private static isConfettiPaused() {
		return this.pause;
	}

	private static pauseConfetti() {
		this.pause = true;
	}

	private static resumeConfetti() {
		this.pause = false;
		this.runAnimation();
	}

	private static runAnimation() {
		if (this.pause)
			return;
		else if (this.particles.length === 0) {
			this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
			this.animationTimer = null;
		} else {
			var now = Date.now();
			var delta = now - this.lastFrameTime;
			if (!this.supportsAnimationFrame || delta > this.confetti.frameInterval) {
				this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
				this.updateParticles();
				this.drawParticles(this.context);
				this.lastFrameTime = now - (delta % this.confetti.frameInterval);
			}
			this.animationTimer = requestAnimationFrame(() => this.runAnimation());
		}
	}

	public static startConfetti(timeout:number = null, min:number = null, max:number = null) {
		var width = window.innerWidth;
		var height = window.innerHeight;
		window.requestAnimationFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				function (callback) {
					return window.setTimeout(callback, this.confetti.frameInterval);
				};
		})();
		var canvas = (<HTMLCanvasElement> document.getElementById("confetti-canvas"));
		if (canvas === null) {
			canvas = (<HTMLCanvasElement> document.createElement("canvas"));
			canvas.setAttribute("id", "confetti-canvas");
			canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none;position:fixed;top:0");
			document.body.prepend(canvas);
			canvas.width = width;
			canvas.height = height;
			window.addEventListener("resize", function() {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			}, true);
			this.context = canvas.getContext("2d");
		} else if (this.context === null)
			this.context = canvas.getContext("2d");
		var count = this.confetti.maxCount;
		if (min) {
			if (max) {
				if (min == max)
					count = this.particles.length + max;
				else {
					if (min > max) {
						var temp = min;
						min = max;
						max = temp;
					}
					count = this.particles.length + ((Math.random() * (max - min) + min) | 0);
				}
			} else
				count = this.particles.length + min;
		} else if (max)
			count = this.particles.length + max;
		while (this.particles.length < count)
			this.particles.push(this.resetParticle({}, width, height));
		this.streamingConfetti = true;
		this.pause = false;
		this.runAnimation();
		if (timeout) {
			window.setTimeout(this.stopConfetti, timeout);
		}
	}

	public static stopConfetti() {
		this.streamingConfetti = false;
	}

	public static removeConfetti() {
		stop();
		this.pause = false;
		this.particles = [];
	}

	public static toggleConfetti() {
		if (this.streamingConfetti)
			this.stopConfetti();
		else
			this.startConfetti();
	}
	
	public static isConfettiRunning() {
		return this.streamingConfetti;
	}

	public static drawParticles(context:CanvasRenderingContext2D) {
		var particle;
		var x, y, x2, y2;
		for (var i = 0; i < this.particles.length; i++) {
			particle = this.particles[i];
			context.beginPath();
			context.lineWidth = particle.diameter;
			x2 = particle.x + particle.tilt;
			x = x2 + particle.diameter / 2;
			y2 = particle.y + particle.tilt + particle.diameter / 2;
			if (this.confetti.gradient) {
				var gradient = context.createLinearGradient(x, particle.y, x2, y2);
				gradient.addColorStop(0, particle.color);
				gradient.addColorStop(1.0, particle.color2);
				context.strokeStyle = gradient;
			} else
				context.strokeStyle = particle.color;
			context.moveTo(x, particle.y);
			context.lineTo(x2, y2);
			context.stroke();
		}
	}

	private static updateParticles() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		var particle;
		this.waveAngle += 0.01;
		for (var i = 0; i < this.particles.length; i++) {
			particle = this.particles[i];
			if (!this.streamingConfetti && particle.y < -15)
				particle.y = height + 100;
			else {
				particle.tiltAngle += particle.tiltAngleIncrement;
				particle.x += Math.sin(this.waveAngle) - 0.5;
				particle.y += (Math.cos(this.waveAngle) + particle.diameter + this.confetti.speed) * 0.5;
				particle.tilt = Math.sin(particle.tiltAngle) * 15;
			}
			if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
				if (this.streamingConfetti && this.particles.length <= this.confetti.maxCount)
					this.resetParticle(particle, width, height);
				else {
					this.particles.splice(i, 1);
					i--;
				}
			}
		}
	}
}