const etdwa = {
  functions: {
    setViewSize: () => {
      const vw = window.innerWidth * 0.01,
        vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vw",`${vw}px`)
      document.documentElement.style.setProperty("--vh",`${vh}px`)
    },
    exportfile: (file = null, name = "export.txt") => {
      if (!file) throw "ファイルデータがないやん"
      const link = document.createElement("a")
      link.download = name
      link.href = URL.createObjectURL(new Blob([file], { type: "text.plain" }))
      link.dataset.downloadurl = ["text/plain", link.download, link.href].join(
        ":"
      )
      link.click()
      link.remove()
    },
    mergeDeeply: (target, source, opts) => {
      const isObject = (obj) =>
        obj && typeof obj === "object" && !Array.isArray(obj)
      const isConcatArray = opts && opts.concatArray
      let result = Object.assign({}, target)
      if (isObject(target) && isObject(source)) {
        for (const [sourceKey, sourceValue] of Object.entries(source)) {
          const targetValue = target[sourceKey]
          if (
            isConcatArray &&
            Array.isArray(sourceValue) &&
            Array.isArray(targetValue)
          ) {
            result[sourceKey] = targetValue.concat(...sourceValue)
          } else if (
            isObject(sourceValue) &&
            target.hasOwnProperty(sourceKey)
          ) {
            result[sourceKey] = etdwa.functions.mergeDeeply(
              targetValue,
              sourceValue,
              opts
            )
          } else {
            Object.assign(result, { [sourceKey]: sourceValue })
          }
        }
      }
      return result
    },
  },
  localSettings: {
    val: {
      theme: 0,
      fontSize: 14,
      consumer_key: "",
      consumer_secret: "",
      columns: [
        {
          name: "Home",
          id: "",
          settings: {},
        },
        {
          name: "Mentions",
          id: "",
          settings: {},
        },
      ],
    },

    set: (name, val) => {
      etdwa.localSettings.val[name] = val
      localStorage.setItem(
        "localSettings",
        JSON.stringify(etdwa.localSettings.val)
      )
      etdwa.localSettings.commit()
    },
    load: () => {
      etdwa.localSettings.val = etdwa.functions.mergeDeeply(
        etdwa.localSettings.val,
        JSON.parse(localStorage.getItem("localSettings"))
      )
      localStorage.setItem(
        "localSettings",
        JSON.stringify(etdwa.localSettings.val)
      )
      etdwa.localSettings.commit()
    },
    commit: () => {
      for (const e in etdwa.localSettings.val) {
        if (e === "theme") {
          const html = document.documentElement
          etdwa.localSettings.val[e] === 0
            ? (html.classList.remove("light"), html.classList.remove("black"))
            : etdwa.localSettings.val[e] === 1
            ? (html.classList.add("light"), html.classList.remove("black"))
            : (html.classList.remove("light"), html.classList.add("black"))
        } else if (e === "fontSize")
          document.body.style.fontSize = etdwa.localSettings.val[e] + "px"
      }
    },
    export: () => {
      etdwa.functions.exportfile(
        JSON.stringify(etdwa.localSettings.val),
        "LocalSettings.json"
      )
    },
  },
}

document.addEventListener("DOMContentLoaded", () => {
  etdwa.functions.setViewSize()
  etdwa.localSettings.load()
})

window.addEventListener("resize", etdwa.functions.setViewSize)
