from flask import Flask, render_template, send_from_directory
app = Flask(__name__, template_folder="./", static_url_path="")

@app.route('/')
def hello():
    return render_template("deck.html")

@app.route('/assets/<path:path>')
def return_asset(path):
    return send_from_directory('assets', path)

if __name__ == "__main__":
    app.run(debug=True)