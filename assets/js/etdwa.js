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
            ? document.documentElement.classList.remove("light")
            : document.documentElement.classList.add("light"))
      })
    },
  },
}

etdwa.localSettings.load()
