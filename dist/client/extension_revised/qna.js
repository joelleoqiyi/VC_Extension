"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (t, n) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? n(exports, require("@tensorflow/tfjs-core"), require("@tensorflow/tfjs-converter")) : "function" == typeof define && define.amd ? define(["exports", "@tensorflow/tfjs-core", "@tensorflow/tfjs-converter"], n) : n(t.qna = {}, t.tf, t.tf);
}(void 0, function (t, n, e) {
  "use strict";

  function r(t, n, e, r) {
    return new (e || (e = Promise))(function (o, i) {
      function u(t) {
        try {
          l(r.next(t));
        } catch (t) {
          i(t);
        }
      }

      function s(t) {
        try {
          l(r.throw(t));
        } catch (t) {
          i(t);
        }
      }

      function l(t) {
        t.done ? o(t.value) : new e(function (n) {
          n(t.value);
        }).then(u, s);
      }

      l((r = r.apply(t, n || [])).next());
    });
  }

  function o(t, n) {
    var e,
        r,
        o,
        i,
        u = {
      label: 0,
      sent: function sent() {
        if (1 & o[0]) throw o[1];
        return o[1];
      },
      trys: [],
      ops: []
    };
    return i = {
      next: s(0),
      throw: s(1),
      return: s(2)
    }, "function" == typeof Symbol && (i[Symbol.iterator] = function () {
      return this;
    }), i;

    function s(i) {
      return function (s) {
        return function (i) {
          if (e) throw new TypeError("Generator is already executing.");

          for (; u;) {
            try {
              if (e = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done) return o;

              switch (r = 0, o && (i = [2 & i[0], o.value]), i[0]) {
                case 0:
                case 1:
                  o = i;
                  break;

                case 4:
                  return u.label++, {
                    value: i[1],
                    done: !1
                  };

                case 5:
                  u.label++, r = i[1], i = [0];
                  continue;

                case 7:
                  i = u.ops.pop(), u.trys.pop();
                  continue;

                default:
                  if (!(o = (o = u.trys).length > 0 && o[o.length - 1]) && (6 === i[0] || 2 === i[0])) {
                    u = 0;
                    continue;
                  }

                  if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
                    u.label = i[1];
                    break;
                  }

                  if (6 === i[0] && u.label < o[1]) {
                    u.label = o[1], o = i;
                    break;
                  }

                  if (o && u.label < o[2]) {
                    u.label = o[2], u.ops.push(i);
                    break;
                  }

                  o[2] && u.ops.pop(), u.trys.pop();
                  continue;
              }

              i = n.call(t, u);
            } catch (t) {
              i = [6, t], r = 0;
            } finally {
              e = o = 0;
            }
          }

          if (5 & i[0]) throw i[1];
          return {
            value: i[0] ? i[1] : void 0,
            done: !0
          };
        }([i, s]);
      };
    }
  }

  function i(t) {
    var n = "function" == typeof Symbol && t[Symbol.iterator],
        e = 0;
    return n ? n.call(t) : {
      next: function next() {
        return t && e >= t.length && (t = void 0), {
          value: t && t[e++],
          done: !t
        };
      }
    };
  }

  function u(t, n) {
    var e = "function" == typeof Symbol && t[Symbol.iterator];
    if (!e) return t;
    var r,
        o,
        i = e.call(t),
        u = [];

    try {
      for (; (void 0 === n || n-- > 0) && !(r = i.next()).done;) {
        u.push(r.value);
      }
    } catch (t) {
      o = {
        error: t
      };
    } finally {
      try {
        r && !r.done && (e = i.return) && e.call(i);
      } finally {
        if (o) throw o.error;
      }
    }

    return u;
  }

  var s = function () {
    function t(t) {
      this.key = t, this.children = {}, this.end = !1;
    }

    return t.prototype.getWord = function () {
      for (var t = [], n = this; null != n;) {
        null != n.key && t.unshift(n.key), n = n.parent;
      }

      return [t, this.score, this.index];
    }, t;
  }(),
      l = function () {
    function t() {
      this.root = new s(null);
    }

    return t.prototype.insert = function (t, n, e) {
      var r,
          o,
          u = this.root,
          l = [];

      try {
        for (var a = i(t), c = a.next(); !c.done; c = a.next()) {
          var f = c.value;
          l.push(f);
        }
      } catch (t) {
        r = {
          error: t
        };
      } finally {
        try {
          c && !c.done && (o = a.return) && o.call(a);
        } finally {
          if (r) throw r.error;
        }
      }

      for (var h = 0; h < l.length; h++) {
        null == u.children[l[h]] && (u.children[l[h]] = new s(l[h]), u.children[l[h]].parent = u), u = u.children[l[h]], h === l.length - 1 && (u.end = !0, u.score = n, u.index = e);
      }
    }, t.prototype.find = function (t) {
      for (var n = this.root, e = 0; e < t.length && null != n;) {
        n = n.children[t[e]], e++;
      }

      return n;
    }, t;
  }();

  function a(t) {
    return /\s/.test(t);
  }

  function c(t) {
    return 0 === t.charCodeAt(0) || 65533 === t.charCodeAt(0);
  }

  var f = "[~`!@#$%^&*(){}[];:\"'<,.>?/\\|-_+=";

  function h(t) {
    return -1 !== f.indexOf(t);
  }

  var p = function () {
    function t() {}

    return t.prototype.load = function () {
      return r(this, void 0, void 0, function () {
        var t, n, e;
        return o(this, function (r) {
          switch (r.label) {
            case 0:
              return t = this, [4, this.loadVocab()];

            case 1:
              for (t.vocab = r.sent(), this.trie = new l(), n = 999; n < this.vocab.length; n++) {
                e = this.vocab[n], this.trie.insert(e, 1, n);
              }

              return [2];
          }
        });
      });
    }, t.prototype.loadVocab = function () {
      return r(this, void 0, void 0, function () {
        return o(this, function (t) {
          return [2, n.util.fetch("https://tfhub.dev/tensorflow/tfjs-model/mobilebert/1/processed_vocab.json?tfjs-format=file").then(function (t) {
            return t.json();
          })];
        });
      });
    }, t.prototype.processInput = function (t) {
      for (var n = this, e = [], r = 0, o = this.cleanText(t, e).split(" ").map(function (t) {
        t = t.toLowerCase();
        var o = n.runSplitOnPunc(t, r, e);
        return r += t.length + 1, o;
      }), i = [], u = 0; u < o.length; u++) {
        i = i.concat(o[u]);
      }

      return i;
    }, t.prototype.cleanText = function (t, n) {
      var e,
          r,
          o = [],
          u = 0,
          s = 0;

      try {
        for (var l = i(t), f = l.next(); !f.done; f = l.next()) {
          var h = f.value;
          if (c(h)) u += h.length;else {
            if (a(h)) {
              if (!(o.length > 0 && " " !== o[o.length - 1])) {
                u += h.length;
                continue;
              }

              o.push(" "), n[s] = u, u += h.length;
            } else o.push(h), n[s] = u, u += h.length;

            s++;
          }
        }
      } catch (t) {
        e = {
          error: t
        };
      } finally {
        try {
          f && !f.done && (r = l.return) && r.call(l);
        } finally {
          if (e) throw e.error;
        }
      }

      return o.join("");
    }, t.prototype.runSplitOnPunc = function (t, n, e) {
      var r,
          o,
          u = [],
          s = !0;

      try {
        for (var l = i(t), a = l.next(); !a.done; a = l.next()) {
          var c = a.value;
          h(c) ? (u.push({
            text: c,
            index: e[n]
          }), n += c.length, s = !0) : (s && (u.push({
            text: "",
            index: e[n]
          }), s = !1), u[u.length - 1].text += c, n += c.length);
        }
      } catch (t) {
        r = {
          error: t
        };
      } finally {
        try {
          a && !a.done && (o = l.return) && o.call(l);
        } finally {
          if (r) throw r.error;
        }
      }

      return u;
    }, t.prototype.tokenize = function (t) {
      var n,
          e,
          r = [],
          o = this.processInput(t);
      o.forEach(function (t) {
        "[CLS]" !== t.text && "[SEP]" !== t.text && (t.text = "▁" + t.text.normalize("NFKC"));
      });

      for (var u = 0; u < o.length; u++) {
        var s = [];

        try {
          for (var l = (n = void 0, i(o[u].text)), a = l.next(); !a.done; a = l.next()) {
            var c = a.value;
            s.push(c);
          }
        } catch (t) {
          n = {
            error: t
          };
        } finally {
          try {
            a && !a.done && (e = l.return) && e.call(l);
          } finally {
            if (n) throw n.error;
          }
        }

        for (var f = !1, h = 0, p = [], d = s.length; h < d;) {
          for (var v = d, g = void 0; h < v;) {
            var y = s.slice(h, v).join(""),
                m = this.trie.find(y);

            if (null != m && null != m.end) {
              g = m.getWord()[2];
              break;
            }

            v -= 1;
          }

          if (null == g) {
            f = !0;
            break;
          }

          p.push(g), h = v;
        }

        f ? r.push(100) : r = r.concat(p);
      }

      return r;
    }, t;
  }();

  var d = "https://tfhub.dev/tensorflow/tfjs-model/mobilebert/1",
      v = function () {
    function t(t) {
      this.modelConfig = t, null == this.modelConfig && (this.modelConfig = {
        modelUrl: d,
        fromTFHub: !0
      }), null == this.modelConfig.fromTFHub && (this.modelConfig.fromTFHub = !1);
    }

    return t.prototype.process = function (t, n, e, r, o) {
      void 0 === o && (o = 128), t = (t = t.replace(/\?/g, "")).trim(), t += "?";
      var i = this.tokenizer.tokenize(t);
      if (i.length > e) throw new Error("The length of question token exceeds the limit (" + e + ").");

      for (var u = this.tokenizer.processInput(n.trim()), s = [], l = [], a = 0; a < u.length; a++) {
        for (var c = u[a].text, f = this.tokenizer.tokenize(c), h = 0; h < f.length; h++) {
          var p = f[h];
          s.push(a), l.push(p);
        }
      }

      for (var d = r - i.length - 3, v = [], g = 0; g < l.length;) {
        var y = l.length - g;
        if (y > d && (y = d), v.push({
          start: g,
          length: y
        }), g + y === l.length) break;
        g += Math.min(y, o);
      }

      return v.map(function (t) {
        var n = [],
            e = [],
            o = {};
        n.push(101), e.push(0);

        for (var a = 0; a < i.length; a++) {
          var c = i[a];
          n.push(c), e.push(0);
        }

        n.push(102), e.push(0);

        for (a = 0; a < t.length; a++) {
          var f = a + t.start,
              h = l[f];
          n.push(h), e.push(1), o[n.length] = s[f];
        }

        n.push(102), e.push(1);

        for (var p = n, d = p.map(function (t) {
          return 1;
        }); p.length < r;) {
          p.push(0), d.push(0), e.push(0);
        }

        return {
          inputIds: p,
          inputMask: d,
          segmentIds: e,
          origTokens: u,
          tokenToOrigMap: o
        };
      });
    }, t.prototype.load = function () {
      return r(this, void 0, void 0, function () {
        var t, i, u, s, l, a;
        return o(this, function (c) {
          switch (c.label) {
            case 0:
              return t = this, [4, e.loadGraphModel(this.modelConfig.modelUrl, {
                fromTFHub: this.modelConfig.fromTFHub
              })];

            case 1:
              return t.model = c.sent(), i = 1, u = n.ones([i, 384], "int32"), s = n.ones([1, 384], "int32"), l = n.ones([1, 384], "int32"), this.model.execute({
                input_ids: u,
                segment_ids: s,
                input_mask: l,
                global_step: n.scalar(1, "int32")
              }), a = this, [4, function () {
                return r(this, void 0, void 0, function () {
                  var t;
                  return o(this, function (n) {
                    switch (n.label) {
                      case 0:
                        return [4, (t = new p()).load()];

                      case 1:
                        return n.sent(), [2, t];
                    }
                  });
                });
              }()];

            case 2:
              return a.tokenizer = c.sent(), [2];
          }
        });
      });
    }, t.prototype.findAnswers = function (t, e) {
      return r(this, void 0, void 0, function () {
        var r,
            i,
            u,
            s,
            l,
            a,
            c,
            f,
            h,
            p,
            d = this;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              if (null == t || null == e) throw new Error("The input to findAnswers call is null, please pass a string as input.");
              return r = this.process(t, e, 64, 384), i = r.map(function (t) {
                return t.inputIds;
              }), u = r.map(function (t) {
                return t.segmentIds;
              }), s = r.map(function (t) {
                return t.inputMask;
              }), l = n.scalar(1, "int32"), a = r.length, c = n.tidy(function () {
                var t = n.tensor2d(i, [a, 384], "int32"),
                    e = n.tensor2d(u, [a, 384], "int32"),
                    r = n.tensor2d(s, [a, 384], "int32");
                return d.model.execute({
                  input_ids: t,
                  segment_ids: e,
                  input_mask: r,
                  global_step: l
                }, ["start_logits", "end_logits"]);
              }), [4, Promise.all([c[0].array(), c[1].array()])];

            case 1:
              for (f = o.sent(), l.dispose(), c[0].dispose(), c[1].dispose(), h = [], p = 0; p < a; p++) {
                h.push(this.getBestAnswers(f[0][p], f[1][p], r[p].origTokens, r[p].tokenToOrigMap, e, p));
              }

              return [2, h.reduce(function (t, n) {
                return t.concat(n);
              }, []).sort(function (t, n) {
                return n.score - t.score;
              }).slice(0, 5)];
          }
        });
      });
    }, t.prototype.getBestAnswers = function (t, n, e, r, o, i) {
      var s;
      void 0 === i && (i = 0);
      var l = this.getBestIndex(t),
          a = this.getBestIndex(n),
          c = [];
      l.forEach(function (e) {
        a.forEach(function (o) {
          r[e] && r[o] && o >= e && o - e + 1 < 32 && c.push({
            start: e,
            end: o,
            score: t[e] + n[o]
          });
        });
      }), c.sort(function (t, n) {
        return n.score - t.score;
      });

      for (var f = [], h = 0; h < c.length && !(h >= 5 || c[h].score < 4.3980759382247925); h++) {
        var p = "",
            d = 0,
            v = 0;
        c[h].start > 0 ? (p = (s = u(this.convertBack(e, r, c[h].start, c[h].end, o), 3))[0], d = s[1], v = s[2]) : p = "", f.push({
          text: p,
          score: c[h].score,
          startIndex: d,
          endIndex: v
        });
      }

      return f;
    }, t.prototype.getBestIndex = function (t) {
      for (var n = [], e = 0; e < 384; e++) {
        n.push([e, e, t[e]]);
      }

      n.sort(function (t, n) {
        return n[2] - t[2];
      });
      var r = [];

      for (e = 0; e < 5; e++) {
        r.push(n[e][0]);
      }

      return r;
    }, t.prototype.convertBack = function (t, n, e, r, o) {
      var i = r + 1,
          u = n[e + 1],
          s = n[i],
          l = t[u].index,
          a = s < t.length - 1 ? t[s + 1].index - 1 : t[s].index + t[s].text.length;
      return [o.slice(l, a + 1).trim(), l, a];
    }, t;
  }();

  t.load = function (t) {
    return r(this, void 0, void 0, function () {
      var n;
      return o(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, (n = new v(t)).load()];

          case 1:
            return e.sent(), [2, n];
        }
      });
    });
  }, t.version = "1.0.0", Object.defineProperty(t, "__esModule", {
    value: !0
  });
});