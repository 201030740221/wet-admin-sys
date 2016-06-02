
var CountDown = React.createClass({
    getInitialState: function() {
        return {
            timer: null,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };
    },
    countDown: function(){
        var self = this,
            endTime = moment(this.props.data.endTime),
            startTime = (this.props.data.startTime && moment(this.props.data.startTime)) || moment(),
            diff = endTime.diff(startTime, 'seconds'),
            minute = 60,
            hour = 60 * minute,
            day = 24 * hour;

        clearInterval(this.state.timer);
        this.setState({
            timer: setInterval(function() {
                diff--;
                var days = Math.floor( diff/day ),
                    hours = Math.floor( (diff-day*days) / hour ),
                    minutes = Math.floor( (diff-day*days-hour*hours) / minute),
                    seconds = diff - day*days - hour*hours - minutes * minute;

                if (diff < 0) {
                    clearInterval(self.state.timer);
                    if (self.props.callback)
                        self.props.callback();
                } else {

                    hours = hours < 10 ? "0" + hours : hours;
                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    seconds = seconds < 10 ? "0" + seconds : seconds;

                    self.setState({
                        days: days,
                        hours: hours,
                        minutes: minutes,
                        seconds: seconds
                    });
                }

            }, 1000)
        });
    },
    componentDidMount: function() {
        this.countDown();
    },
    componentWillReceiveProps: function(){
        this.countDown();
    },
    componentWillUnmount: function() {
        clearInterval(this.state.timer);
    },
    render: function() {
        var Content = this.props.component;
        return (
            <Content isworking={this.props.isworking || false } days={this.state.days} hours={this.state.hours} minutes={this.state.minutes} seconds={this.state.seconds}/>
        );
    }
});

module.exports = CountDown;