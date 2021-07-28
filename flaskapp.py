from logging import DEBUG
from flask import Flask, render_template, send_from_directory, request, redirect
import os
import json
from requests_oauthlib import OAuth1Session
import requests
from urllib.parse import parse_qsl

app = Flask(__name__, template_folder="./", static_url_path="")

try:
    Keys = json.load(open("keys.json", "r"))
    CK = Keys["CK"]
    CS = Keys["CS"]
except FileNotFoundError as e:
    print("Keys.json not found; falling back to env")
    CK = os.environ.get("CK")
    CS = os.environ.get("CS")

# URLs
AccVerifyURL = "https://api.twitter.com/1.1/account/verify_credentials.json"
UserTLURL = "https://api.twitter.com/1.1/statuses/user_timeline.json"
ReqTokenURL = "https://api.twitter.com/oauth/request_token"
AuthURL = "https://api.twitter.com/oauth/authenticate"

@app.route('/')
def hello():
    print(request.cookies.get("at"))
    if (not request.cookies.get("at") == None and not request.cookies.get("as") == None) and (not request.cookies.get("at") == "" and not request.cookies.get("as") == ""):
        return render_template("deck.html")

    oauth_callback = "oob"

    twitter = OAuth1Session(CK, CS)

    request_token_url = ReqTokenURL

    response = twitter.post(
        request_token_url,
        params={'oauth_callback': oauth_callback}
    )

    # responseからリクエストトークンを取り出す
    request_token = dict(parse_qsl(response.content.decode("utf-8")))

    # リクエストトークンから連携画面のURLを生成
    authenticate_url = AuthURL
    authenticate_endpoint = "#"
    try:
        authenticate_endpoint = '%s?oauth_token=%s' % (authenticate_url, request_token['oauth_token'])
    except KeyError:
        authenticate_endpoint = request_token

    print(authenticate_endpoint)
    return render_template("deck.html", url=authenticate_endpoint, token=request_token['oauth_token'])


@app.route("/login")
def login():
    # Twitter Application Management で設定したコールバックURLsのどれか
    # oauth_callback = "{0}://{1}/oauth/".format(request.scheme, request.host)
    oauth_callback = "oob"

    twitter = OAuth1Session(CK, CS)

    request_token_url = ReqTokenURL

    response = twitter.post(
        request_token_url,
        params={'oauth_callback': oauth_callback}
    )

    # responseからリクエストトークンを取り出す
    request_token = dict(parse_qsl(response.content.decode("utf-8")))

    # リクエストトークンから連携画面のURLを生成
    authenticate_url = AuthURL
    authenticate_endpoint = "#"
    try:
        authenticate_endpoint = '%s?oauth_token=%s' % (authenticate_url, request_token['oauth_token'])
    except KeyError:
        authenticate_endpoint = request_token

    print(authenticate_endpoint)
    return render_template("oauth.html", url=authenticate_endpoint, token=request_token['oauth_token'])


@app.route("/oauth/")
def oauth():

    res = redirect("/")

    oauthtoken = request.args["oauth_token"]
    oauthverifier = request.args["oauth_verifier"]

    twitter = OAuth1Session(CK, CS, oauthtoken, oauthverifier)

    t = twitter.post("https://api.twitter.com/oauth/access_token", params={'oauth_verifier': oauthverifier, "oauth_token": oauthtoken})

    print(t)

    access_token = dict(parse_qsl(t.content.decode("utf-8")))

    print(access_token)

    res.set_cookie("at", access_token["oauth_token"])
    res.set_cookie("as", access_token["oauth_token_secret"])

    return res


@app.route('/assets/<path:path>')
def return_asset(path):
    return send_from_directory('assets', path)

@app.route("/get/<path:url>")
def make_get(url):
    url = "https://api.twitter.com/" + url
    t = OAuth1Session(CK, CS, request.cookies.get("at"), request.cookies.get("as"))
    res = t.get(url)
    # print(res.text)
    return res.text

@app.route("/post/<path:url>", methods=["POST"])
def make_post(url):
    url = "https://api.twitter.com/" + url
    t = OAuth1Session(CK, CS, request.cookies.get("at"), request.cookies.get("as"))
    res = t.post(url, params=json.loads(request.get_data()))
    print(res.text)
    return res.text

if __name__ == "__main__":
    debug = os.environ.get("DEBUG")
    if debug == None:
        debug = True
    port = 5000
    if os.environ.get("PORT"):
        port = os.environ.get("PORT")
    app.run(debug=debug, port=port, host="0.0.0.0")