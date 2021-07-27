const etdwa = {
  localSettings: {
    val: {
      theme: 0,
    },

    set: function (name, val) {
      this.val[name] = val
      localStorage.setItem("localSettings", JSON.stringify(this.val))
      this.commit()
    },
    load: function () {
      localStorage.getItem("localSettings") === null
        ? localStorage.setItem("localSettings", JSON.stringify(this.val))
        : (this.val = JSON.parse(localStorage.getItem("localSettings")))
      this.commit()
    },
    commit: function () {
      Object.keys(this.val).forEach((e) => {
        e === "theme" &&
          (this.val[e] === 0
            ? (document.documentElement.classList.remove("light"),
              document.documentElement.classList.remove("black"))
            : this.val[e] === 1
            ? (document.documentElement.classList.add("light"),
              document.documentElement.classList.remove("black"))
            : (document.documentElement.classList.remove("light"),
              document.documentElement.classList.add("black")))
      })
    },
  },
}

etdwa.localSettings.load()

window.addEventListener("load", () => {
  $("<a href='#' style='font-size:.7em'>テーマ(仮)</a>")
    .click(() =>
      etdwa.localSettings.set("theme", (etdwa.localSettings.val.theme + 1) % 3)
    )
    .appendTo(".sidebar_bottom_btns")
  console.log(
    "etdwa.jsでテーマ切り替えボタンを仮で置いてます\n切りたい場合は36~43行目をコメントアウトしてください"
  )
})
