/* eslint-disable max-len */
class DoomHead {
    constructor() {
        this.containerId = 'doomhead';
        this.updateInterval = 30000;
        this.container = $('#' + this.containerId);
        this.heads = [];
        for(let i=0; i<10; i++) {
            let image = new Image();
            image.src = `img/head/head_${i}.gif`;
            this.heads.push(image);
        }
        this.DEFAULT = 4;
        this.currentHeadIndex = this.DEFAULT;
        this.timer = setInterval(() => this._checkStats(), this.updateInterval);

    }

    show() {
        this.container.show();
    }

    hide() {
        this.container.hide();
    }

    showText(show) {
        this._showText = show;
        this._setText();
    }

    _checkStats() {
        $.get('/stats', (data) => {
            let dead = data.dead;
            let alive = data.alive;
            if(!dead || !alive) {
                this.currentHeadIndex = this.DEFAULT;
            } else {
                this.currentHeadIndex = this._getIndex(dead, alive, this.currentHeadIndex);
            }
            this.container.find('img').attr('src', this.heads[this.currentHeadIndex].src);
            this._setText();
        });
    }

    _setText() {
        let text = this._showText? this._getText(this.currentHeadIndex) : '';
        this.container.find('.text').text(text);
    }

    _getText(index) {
        if(index > 4) {
            return 'game over';
        }
        return 'you win!';
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
