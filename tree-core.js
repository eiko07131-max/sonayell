(function () {
  const KEY = 'sonayell_v2';

  // 正式な成長段階
  const STAGES = [3, 5, 7, 13, 28, 35, 45, 50];

  function readState(w) {
    try {
      return JSON.parse(w.localStorage.getItem(KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function readTotal(w) {
    const s = readState(w);
    return Math.max(0, Number(s.yell) || 0);
  }

  function readLikeCount(w) {
    const s = readState(w);

    return Math.max(
      0,
      Number(
        s.receivedLikes ??
        s.likeCount ??
        s.likes ??
        s.postLikes ??
        0
      ) || 0
    );
  }

  function readSaveCount(w) {
    const s = readState(w);

    return Math.max(
      0,
      Number(
        s.receivedSaves ??
        s.saveCount ??
        s.saves ??
        s.postSaves ??
        0
      ) || 0
    );
  }

  function cycle(total) {
    total = Math.max(0, Number(total) || 0);

    if (total === 0) {
      return {
        total: 0,
        step: 0,
        grown: 0
      };
    }

    const rem = total % 50;

    return {
      total,
      step: rem === 0 ? 50 : rem,
      grown: Math.floor((total - 1) / 50)
    };
  }

  function getStage(step) {
    if (step >= 50) return 8;
    if (step >= 45) return 7;
    if (step >= 35) return 6;
    if (step >= 28) return 5;
    if (step >= 13) return 4;
    if (step >= 7) return 3;
    if (step >= 5) return 2;
    if (step >= 3) return 1;
    return 0;
  }

  function getTreeEmoji(step, likes, saves) {
    const stage = getStage(step);

    if (stage === 0) return '🌰';
    if (stage === 1) return '🌱';
    if (stage === 2) return '🌱';
    if (stage === 3) return '🌿';
    if (stage === 4) return '🌿';
    if (stage === 5) return '🌲';
    if (stage === 6) return '🌳';

    // 45YELLから特別分岐
    if (stage === 7) {
      const flower = saves >= 10;
      const fruit = likes >= 20;

      if (flower && fruit) return '🌸🍎🌳🍎🌸';
      if (flower) return '🌸🌸🌳🌸🌸';
      if (fruit) return '🍎🍎🌳🍎🍎';

      return '🌳';
    }

    // 50YELL完成時
    if (stage >= 8) {
      const flower = saves >= 10;
      const fruit = likes >= 20;

      if (flower && fruit) return '🌸🍎🌳🍎🌸';
      if (flower) return '🌸🌸🌳🌸🌸';
      if (fruit) return '🍎🍎🌳🍎🍎';

      return '🌳';
    }

    return '🌱';
  }

  function getStageText(step) {
    if (step >= 50) return '大樹完成！';
    if (step >= 45) return 'もうすぐ大樹！';
    if (step >= 35) return '立派な木';
    if (step >= 28) return '若い木';
    if (step >= 13) return '小さな木';
    if (step >= 7) return '元気な若葉';
    if (step >= 5) return '葉っぱが増えたよ';
    if (step >= 3) return '芽が出たよ';
    return '土の中で準備中';
  }

  function nextStage(step) {
    for (const n of STAGES) {
      if (step < n) return n;
    }

    return 50;
  }

  function ensureStyle(d) {
    let s = d.getElementById('sonayellTreeCoreStyle');

    if (!s) {
      s = d.createElement('style');
      s.id = 'sonayellTreeCoreStyle';
      d.head.appendChild(s);
    }

    s.textContent = `
      .yellBadge,
      .treeYell,
      #myTreeCard .yellBadge,
      #myTreeCard [class*="Yell"]{
        display:none!important;
      }

      #myTreeEmoji{
        font-size:92px!important;
        line-height:1.15!important;
        text-align:center!important;
        transition:transform .35s ease!important;
      }

      #myTreeEmoji:hover{
        transform:scale(1.04);
      }

      .treeSpecialStatus{
        margin-top:12px;
        padding:12px;
        border-radius:14px;
        background:#fffaf0;
        text-align:center;
        line-height:1.7;
        font-size:13px;
      }

      .treeSpecialTitle{
        font-weight:bold;
        color:#397a44;
        font-size:15px;
      }
    `;
  }

  function renderSpecialStatus(d, step, likes, saves) {
    let box = d.getElementById('treeSpecialStatus');

    const card = d.getElementById('myTreeCard');

    if (!card) return;

    if (!box) {
      box = d.createElement('div');
      box.id = 'treeSpecialStatus';
      box.className = 'treeSpecialStatus';

      const remain = d.getElementById('treeRemain');

      if (remain && remain.parentNode) {
        remain.parentNode.insertBefore(box, remain.nextSibling);
      } else {
        card.appendChild(box);
      }
    }

    if (step < 45) {
      box.style.display = 'none';
      return;
    }

    box.style.display = 'block';

    const flowerOK = saves >= 10;
    const fruitOK = likes >= 20;

    if (flowerOK && fruitOK) {
      box.innerHTML = `
        <div class="treeSpecialTitle">🌸🍎 豪華なYELLの木！ 🍎🌸</div>
        保存 ${saves} ／ 10 達成<br>
        いいね ${likes} ／ 20 達成<br>
        花5輪＋実5個が育ったよ！
      `;
      return;
    }

    if (flowerOK) {
      box.innerHTML = `
        <div class="treeSpecialTitle">🌸 花が咲いたよ！</div>
        保存 ${saves} ／ 10 達成<br>
        花5輪が咲きました。<br>
        あと いいね ${Math.max(0, 20 - likes)} で実もなるよ！
      `;
      return;
    }

    if (fruitOK) {
      box.innerHTML = `
        <div class="treeSpecialTitle">🍎 実がなったよ！</div>
        いいね ${likes} ／ 20 達成<br>
        実5個が育ちました。<br>
        あと 保存 ${Math.max(0, 10 - saves)} で花も咲くよ！
      `;
      return;
    }

    box.innerHTML = `
      <div class="treeSpecialTitle">🌳 45YELL到達！</div>
      保存 ${saves} ／ 10<br>
      いいね ${likes} ／ 20<br>
      応援が集まると、花や実が育つよ。
    `;
  }

  function render(w) {
    const d = w.document;

    if (!d) return;

    ensureStyle(d);

    const c = cycle(readTotal(w));
    const step = c.step;
    const likes = readLikeCount(w);
    const saves = readSaveCount(w);

    d.querySelectorAll('.yellBadge,.treeYell')
      .forEach(x =>
        x.style.setProperty(
          'display',
          'none',
          'important'
        )
      );

    const card = d.getElementById('myTreeCard');

    if (card) {
      card.querySelectorAll('.yellBadge,.treeYell')
        .forEach(x =>
          x.style.setProperty(
            'display',
            'none',
            'important'
          )
        );
    }

    const emoji = d.getElementById('myTreeEmoji');

    if (emoji) {
      emoji.textContent =
        getTreeEmoji(
          step,
          likes,
          saves
        );

      emoji.setAttribute(
        'aria-label',
        getStageText(step)
      );
    }

    const progress =
      d.getElementById('treeProgressText');

    if (progress) {
      progress.textContent =
        step + ' / 50';
    }

    const leaves =
      d.getElementById('treeLeaves');

    if (leaves) {
      leaves.innerHTML = '';

      for (let i = 0; i < 50; i++) {
        const leaf =
          d.createElement('span');

        leaf.className =
          'treeLeaf' +
          (i < step ? ' on' : '');

        leaf.textContent = '🍃';

        leaves.appendChild(leaf);
      }
    }

    const remain =
      d.getElementById('treeRemain');

    if (remain) {
      if (step === 50) {
        remain.innerHTML =
          '🎉 大樹になったよ！' +
          '<br>' +
          '<small>' +
          '50YELL達成！あなたの備えと応援が、大きな木になりました。' +
          '</small>';
      } else {
        const next =
          nextStage(step);

        const grown =
          c.grown > 0
            ? '<small>🌳 育てた大樹 ' +
              c.grown +
              '本</small><br>'
            : '';

        remain.innerHTML =
          grown +
          '<strong>' +
          getStageText(step) +
          '</strong><br>' +
          '次の成長まであと ' +
          '<strong>' +
          Math.max(0, next - step) +
          '</strong> YELL！' +
          '<br>' +
          '<small>' +
          '3 → 5 → 7 → 13 → 28 → 35 → 45 → 50' +
          '</small>';
      }
    }

    renderSpecialStatus(
      d,
      step,
      likes,
      saves
    );
  }

  function install(w) {
    if (!w || !w.document) {
      return false;
    }

    ensureStyle(w.document);

    w.renderMyTree =
      function () {
        render(w);
      };

    if (
      typeof w.update === 'function' &&
      !w.__treeCoreUpdateWrapped
    ) {
      const oldUpdate = w.update;

      w.update =
        function () {
          const result =
            oldUpdate.apply(
              this,
              arguments
            );

          setTimeout(
            () => render(w),
            0
          );

          return result;
        };

      w.__treeCoreUpdateWrapped =
        true;
    }

    render(w);

    setTimeout(
      () => render(w),
      50
    );

    setTimeout(
      () => render(w),
      300
    );

    return true;
  }

  window.SonaYellTreeCore = {
    install,
    cycle,
    getStage
  };
})();
