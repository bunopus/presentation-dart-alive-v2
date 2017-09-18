class DoomHead {
    constructor() {
        this.containerId = 'doomhead';
        this.updateInterval = 5000;
        this.container = $('#' + this.containerId);
    }

    show() {
        this.container.show();
        this.timer = setInterval(this._checkStats, this.updateInterval);
        this._checkStats();
    }

    hide() {
        this.container.hide();
        clearInterval(this.timer);
    }

    _checkStats() {
        $.get('http://localhost:3000/stats', (data) => {
            console.log(data);
        });
    }
}
