const etdwa = {
  localSettings: {
    val: {
      theme: 0,
    },

    set: async function (name, val) {
      this.val[name] = val
      localStorage.setItem("localSettings", JSON.stringify(this.val))
      await this.commit()
    },
    load: async function () {
      localStorage.getItem("localSettings") === null
        ? localStorage.setItem("localSettings", JSON.stringify(this.val))
        : (this.val = JSON.parse(localStorage.getItem("localSettings")))
      await this.commit()
    },
    commit: async function () {
      Object.keys(this.val).forEach(async (e) => {
        e === "theme" &&
          (this.val[e] === 0
            ? document.documentElement.classList.remove("light")
            : document.documentElement.classList.add("light"))
      })
    },
  },
}

await etdwa.localSettings.load()
