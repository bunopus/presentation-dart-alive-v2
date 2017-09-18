class DoomHead {
    constructor() {
        this.containerId = 'doomhead';
        this.updateInterval = 5000;
        this.container = $('#' + this.containerId);
        this.heads = [];
        for(let i=0; i<10;i++){
            let image = new Image();
            image.src = `img/head/head_${i}.png`;
            this.heads.push(image);
        }
        this.currentHeadIndex = 0;
    }

    show() {
        this.container.show();
        this.timer = setInterval(() => this._checkStats(), this.updateInterval);
        this._checkStats();
    }

    hide() {
        this.container.hide();
        clearInterval(this.timer);
    }

    _checkStats() {
        $.get('http://localhost:3000/stats', (data) => {
            let dead = data.dead;
            let alive = data.alive;
            this.currentHeadIndex = this._getIndex(dead, alive);
            this.container.find('img').attr('src', this.heads[this.currentHeadIndex].src);
        });
    }

    _getIndex(dead, alive) {
        let retVal = 4;
        if(dead<20 && alive <20) return retVal;
        let percent = (dead / alive) * 100;
        if (percent >= 0 && percent < 25) retVal = 0;
        else if (percent >= 25 && percent < 50) retVal = 1;
        else if (percent >= 50 && percent < 75) retVal = 2;
        else if (percent >= 75 && percent < 95) retVal = 3;
        else if (percent >= 110 && percent < 125) retVal = 5;
        else if (percent >= 125 && percent < 150) retVal = 6;
        else if (percent >= 150 && percent < 175) retVal = 7;
        else if (percent >= 175 && percent < 200) retVal = 8;
        else if (percent >= 200) retVal = 9;
        else retVal = 4;
        return retVal;
    }
}
