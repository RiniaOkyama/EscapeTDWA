const etdwa = {
  functions: {
    exportfile: (file = null, name = "export.txt") => {
      if (!file) throw "ファイルデータがないやん"
      const link = document.createElement("a")
      link.download = name
      link.href = URL.createObjectURL(new Blob([file], { type: "text.plain" }))
      link.dataset.downloadurl = ["text/plain", link.download, link.href].join(
        ":"
      )
      link.click()
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
      consumer_key: "",
      consumer_secret: "",
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
        e === "theme" &&
          (etdwa.localSettings.val[e] === 0
            ? (document.documentElement.classList.remove("light"),
              document.documentElement.classList.remove("black"))
            : etdwa.localSettings.val[e] === 1
            ? (document.documentElement.classList.add("light"),
              document.documentElement.classList.remove("black"))
            : (document.documentElement.classList.remove("light"),
              document.documentElement.classList.add("black")))
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
