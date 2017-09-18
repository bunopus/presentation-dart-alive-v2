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
        this.currentHeadIndex = 4;
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
            this.currentHeadIndex = this._getIndex(dead, alive, this.currentHeadIndex);
            this.container.find('img').attr('src', this.heads[this.currentHeadIndex].src);
        });
    }

    _getIndex(dead, alive, current) {
        let retVal = current;
        if(dead<20 && alive <20) return retVal;

        let percent = (dead / alive) * 100;
        if (percent >= 0 && percent < 90) retVal--;
        else if (percent >= 110) retVal++;

        if(retVal > 9) retVal = 9;
        if(retVal < 0) retVal = 0;
        return retVal;
    }
}
