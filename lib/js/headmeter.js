/* eslint-disable max-len */
class DoomHead {
    constructor() {
        this.NORMAL_HEAD_INDEX = 5;
        this.containerId = 'doomhead';
        this.updateInterval = 5000;
        this.container = $('#' + this.containerId);
        this.heads = [];
        for(let i=1; i<=10; i++) {
            let image = new Image();
            image.src = `img/head/head_${i}.gif`;
            this.heads.push(image);
        }
        this.currentHeadIndex = this.NORMAL_HEAD_INDEX;
        this.percents = 100;
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

            let percents = this._getPercents(this.percents, dead, alive, this.dead, this.alive);
            this.currentHeadIndex = this._getIndex(percents);

            this._setPercents(percents);
            this.container.find('img.head-image').attr('src', this.heads[this.currentHeadIndex].src);

            this._setText();

            if(percents !== this.percents) {
                this.dead = dead;
                this.alive = alive;
                this.percents = percents;
            }
        });
    }

    _setText() {
        let text = this._showText? this._getText(this.currentHeadIndex) : '';
        this.container.find('.text').text(text);
    }

    _getText(index) {
        if(index < this.NORMAL_HEAD_INDEX) {
            return 'game over';
        }
        return 'you win!';
    }

    _getIndex(percents) {
        if (percents === 100) return this.NORMAL_HEAD_INDEX;
        let index = Math.ceil(percents / 20)-1;
        return this._getNumInRange(index, 0, 9);
    }

    _getNumInRange(num, min, max) {
        if (num >= max) return max;
        else if (num <= min) return min;
        return num;
    }

    _setPercents(percents) {
        let percentHtml = this._getPercentHtml(percents);
        let percCont = this.container.find('.percents');
        percCont.empty();
        percCont.html(percentHtml);
    }

    _getPercentHtml(percents) {
        let res = '';
        let str = percents.toString();
        for (let num of str) {
            res += `<img src='img/percents/${num}.png'>`;
        }
        res += `<img src='img/percents/sign.png'>`;
        return res;
    }

    _getPercents(currentPercents, newDead = 0, newAlive = 0, oldDead = 0, oldAlive = 0) {
        let percents = currentPercents;
        const voteMultiplier = 1;
        percents -= (newDead - oldDead)/voteMultiplier;
        percents += (newAlive - oldAlive)/voteMultiplier;
        percents = percents >= currentPercents ? Math.trunc(percents) : Math.ceil(percents);
        return this._getNumInRange(percents, 0, 200);
    }
}
