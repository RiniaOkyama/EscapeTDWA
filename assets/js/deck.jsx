function getTL() {
    //var val = (await fetch("/assets/sampletimeline.json")).json()
    //return val  //壊れています。
    var tl
    return fetch("/assets/sampletimeline.json")
        .then((resp) => {
            // console.log(resp.json())
            return resp
        })
}
class Tweet extends React.Component {
    render() {
        let tweet = this.props.item;
        console.log(this.props);
        const RTuser = tweet.user;
        let RTstats = "";
        if ("retweeted_status" in tweet) {
            tweet.favorite_count =
                tweet.retweeted_status.favorite_count;
            tweet.user = tweet.retweeted_status.user;
            RTstats = (
                <span className="retweeted_status">
                    <i className="retweet_icon">RTicon</i>
                    {RTuser.name} Retweeted
                </span>
            );
        }

        return (
            <article className="tweet">
                {RTstats}
                <img
                    src={tweet.user.profile_image_url_https}
                    className="profile_icon"
                ></img>
                <div className="tweet_user">
                    <span className="username">
                        {tweet.user.name}
                    </span>
                    <span className="screen_name">
                        @{tweet.user.screen_name}
                    </span>
                </div>
                <div className="tweet_content">
                    <div className="tweet_text">{tweet.text}</div>
                    <div className="tweet_action_btns">
                        <div className="reply_btns">
                            <span className="reply_btn">
                                りぷぼたん
                            </span>
                            /*どうやって数を取得するのこれ*/
                        </div>
                        <div className="retweet_btns">
                            <span className="retweet_btn">
                                りついーとぼたん
                            </span>
                            {tweet.retweet_count}
                        </div>
                        <div className="fav_btns">
                            <span className="fav_btn">
                                はーとぼたん
                            </span>
                            {tweet.favorite_count}
                        </div>
                    </div>
                </div>
            </article>
        );
    }
}

class Tweets extends React.Component {
    constructor(props) {
        super(props);
        this.state = { //state初期化
            isLoaded: false,
            timeline: []
        };
    }
    componentDidMount() {
        fetch("/assets/sampletimeline.json")
            .then((resp) => {
                // console.log(resp.json())
                return resp.json()
            })
            .then((data) => {
                // tl = data
                console.log(typeof data)
                this.setState(
                    {
                        isLoaded: true,
                        timeline: data
                    }
                )
            })

    }
    render() {
        const { isLoaded, timeline } = this.state
        console.log(this.state)
        if (isLoaded) {
            let articles = [];
            timeline.forEach((item) => {
                articles.push(<Tweet item={item} key={item.id_str} />);
            });
            return (
                <div className="article_list">
                    {articles}
                </div>
            );
        }
        else {
            return <div className="loading_tweets">Loading tweets...</div>
        }
    }
}

class ColumnTitle extends React.Component {
    render() {
        return (
            <div className="column_header">
                <i>icon</i>からむのたいとる
            </div>
        );
    }
}

class Column extends React.Component {
    render() {
        //Check column type: Tweet only for now
        return (
            <div className="column">
                <ColumnTitle />
                <React.Suspense>
                    <Tweets />
                </React.Suspense>
            </div>
        );
    }
}

class Columns extends React.Component {
    render() {
        return (
            <div className="columns">
                <Column />
                <Column />
            </div>
        );
    }
}

class Sidebar extends React.Component {

    render() {
        function changeTheme() {
            etdwa.localSettings.set("theme", (etdwa.localSettings.val.theme + 1) % 3)
        }
        function logout(){
            document.cookie = "at=;";
            document.cookie = "as=;";
            window.location.reload()
        }
        return (
            <div className="sidebar">
                <div className="sidebar_items">
                    <div className="sidebar_upper_btns">
                        <button className="tweetbtn">
                            ついーとぼたん
                        </button>
                    </div>
                    <div className="sidebar_column_btns"></div>
                    <div className="sidebar_bottom_btns">
                        <button onClick={changeTheme}>ﾃｰﾏﾎﾞﾀﾝ</button>
                        <button onClick={logout}>ﾛｸﾞｱｳﾄ</button>
                    </div>
                </div>
            </div>
        );
    }
}

class Login extends React.Component {
    render () {
        const url = document.body.getAttribute("data-url")
        const oauth_token = document.body.getAttribute("data-token")
        return(
            <div className="login">
                <a href={url} target="_blank" className="login_link">ここを押してログイン</a>
                <form action="/oauth/" className="login_form">
                    <label htmlFor="oauth_verifier" className="login_label">表示されたキーを入力</label>
                    <input type="number" name="oauth_verifier" id="oauth_verifier" className="login_value"></input>
                    <input type="hidden" name="oauth_token" value={oauth_token}></input>
                    <button type="submit" className="login_submit">送信</button>
                </form>
            </div>
        )
    }
}

class TD extends React.Component {
    render() {
        var output = {}
        document.cookie.split(/\s*;\s*/).forEach(function(pair) {
            pair = pair.split(/\s*=\s*/);
            output[pair[0]] = pair.splice(1).join('=');
        });
        if("at" in output && "as" in output){
            if(output["at"] != output["as"]){
                return (
                    <div className="TDapp">
                        <Sidebar />
                        <Columns />
                    </div>
                );
            }
        }

        return <Login />

    }
}
//
ReactDOM.render(<TD />, document.querySelector("#app"));