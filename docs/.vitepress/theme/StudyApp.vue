<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'
import { chapters, questions, codingProblems, flashcards } from './data.js'

const STORAGE_KEY = 'java-learning-progress-v1'
const intervals = [1, 3, 7, 15]
const tabs = [
  { id: 'learn', label: '章节知识' },
  { id: 'practice', label: '客观题' },
  { id: 'coding', label: '编程自评' },
  { id: 'cards', label: '闪卡' },
  { id: 'wrong', label: '错题复习' },
  { id: 'exam', label: '模拟考试' },
  { id: 'progress', label: '学习进度' }
]
const tab = ref('learn')
const selectedChapter = ref('02')
const answers = ref({})
const checked = ref({})
const codeDrafts = ref({})
const codeRevealed = ref({})
const showCardBack = ref(false)
const cardIndex = ref(0)
const records = ref({})
const tip = ref('')
const examSize = ref(10)
const examMinutes = ref(20)
const examItems = ref([])
const examAnswers = ref({})
const examActive = ref(false)
const examFinished = ref(false)
const examScore = ref(0)
const examDeadline = ref(0)
const now = ref(Date.now())
let timer

const chapter = computed(() => chapters.find(c => c.number === selectedChapter.value) || chapters[0])
const chapterQuestions = computed(() => questions.filter(q => q.chapter === selectedChapter.value))
const chapterCoding = computed(() => codingProblems.filter(q => q.chapter === selectedChapter.value))
const chapterCards = computed(() => flashcards.filter(q => q.chapter === selectedChapter.value))
const card = computed(() => chapterCards.value[cardIndex.value % (chapterCards.value.length || 1)])
const totalItems = computed(() => questions.length + codingProblems.length + flashcards.length)
const attempted = computed(() => Object.keys(records.value).filter(id => allIds.has(id)).length)
const mastered = computed(() => Object.entries(records.value).filter(([id, entry]) => allIds.has(id) && entry.lastCorrect && entry.stage >= 1).length)
const wrongItems = computed(() => Object.keys(records.value).filter(id => allIds.has(id) && records.value[id]?.wrongCount > 0).map(id => ({
  id,
  entry: records.value[id],
  q: questions.find(q => q.id === id) || codingProblems.find(q => q.id === id) || flashcards.find(q => q.id === id)
})).filter(x => x.q).sort((a, b) => (a.entry.dueAt || 0) - (b.entry.dueAt || 0)))
const dueItems = computed(() => wrongItems.value.filter(x => (x.entry.dueAt || 0) <= now.value))
const remainingSeconds = computed(() => Math.max(0, Math.ceil((examDeadline.value - now.value) / 1000)))
const allIds = new Set([...questions, ...codingProblems, ...flashcards].map(x => x.id))

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (saved.version === 1 && saved.records && typeof saved.records === 'object' && !Array.isArray(saved.records)) {
      records.value = saved.records
    }
  } catch {
    tip.value = '本机进度读取失败，可使用备份 JSON 恢复。'
  }
  timer = window.setInterval(() => {
    now.value = Date.now()
    if (examActive.value && now.value >= examDeadline.value) finishExam()
  }, 1000)
})
onUnmounted(() => { if (timer) window.clearInterval(timer) })

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), records: records.value }))
  } catch {
    tip.value = '保存失败：浏览器存储空间不足或禁用了本地存储。请及时导出备份。'
  }
}
function record(id, correct) {
  const prev = records.value[id] || { attempts: 0, correctCount: 0, wrongCount: 0, stage: -1 }
  const stage = correct ? Math.min((Number.isInteger(prev.stage) ? prev.stage : -1) + 1, intervals.length - 1) : -1
  const today = Date.now()
  records.value = {
    ...records.value,
    [id]: {
      attempts: (prev.attempts || 0) + 1,
      correctCount: (prev.correctCount || 0) + Number(correct),
      wrongCount: (prev.wrongCount || 0) + Number(!correct),
      stage,
      lastCorrect: !!correct,
      lastAt: today,
      dueAt: correct ? today + intervals[stage] * 86400000 : today
    }
  }
  saveProgress()
}
function normalizeText(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase()
}
function normalizeOutput(value) {
  return String(value ?? '').replace(/\r\n/g, '\n').trim().split('\n').map(line => line.trimEnd()).join('\n')
}
function grade(q, value) {
  if (q.type === 'multiple') {
    return Array.isArray(value) && Array.isArray(q.answer) &&
      value.length === q.answer.length && value.every(x => q.answer.includes(x))
  }
  if (q.type === 'truefalse') return value === String(q.answer)
  if (q.type === 'output') return normalizeOutput(value) === normalizeOutput(q.answer)
  if (q.type === 'blank') {
    const accepted = Array.isArray(q.answer) ? q.answer : [q.answer]
    return accepted.some(answer => normalizeText(value) === normalizeText(answer))
  }
  return value === q.answer
}
function hasAnswer(q, value) {
  if (q.type === 'multiple') return Array.isArray(value) && value.length > 0
  return value !== undefined && value !== null && String(value).trim() !== ''
}
function toggleMultiple(qid, option, enabled, target) {
  const current = Array.isArray(target[qid]) ? target[qid] : []
  target[qid] = enabled ? [...new Set([...current, option])] : current.filter(v => v !== option)
}
function check(q) {
  if (!hasAnswer(q, answers.value[q.id]) || checked.value[q.id] !== undefined) return
  const result = grade(q, answers.value[q.id])
  checked.value = { ...checked.value, [q.id]: result }
  record(q.id, result)
}
function retry(qid) {
  const next = { ...answers.value }; delete next[qid]; answers.value = next
  const results = { ...checked.value }; delete results[qid]; checked.value = results
}
function answerDisplay(q) {
  if (q.type === 'truefalse') return q.answer ? '正确' : '错误'
  return Array.isArray(q.answer) ? q.answer.join(' / ') : q.answer
}
function chapterFor(q) {
  return chapters.find(ch => ch.number === q.chapter)?.title || '未知章节'
}
function switchChapter(value) {
  selectedChapter.value = value
  cardIndex.value = 0
  showCardBack.value = false
}
function goTo(item) {
  switchChapter(item.chapter)
  tab.value = questions.some(q => q.id === item.id) ? 'practice' :
    codingProblems.some(q => q.id === item.id) ? 'coding' : 'cards'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function reviewCard(correct) {
  if (!card.value || !showCardBack.value) return
  record(card.value.id, correct)
  nextCard()
}
function nextCard() {
  cardIndex.value += 1
  showCardBack.value = false
}
function shuffle(items) {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
function pickProportional(pool, target) {
  const groups = chapters.map(ch => ({
    chapter: ch.number,
    items: shuffle(pool.filter(q => q.chapter === ch.number))
  })).filter(group => group.items.length)
  const n = Math.min(target, pool.length)
  const quotas = groups.map(group => ({
    ...group,
    share: n * group.items.length / pool.length,
    count: Math.floor(n * group.items.length / pool.length)
  }))
  let left = n - quotas.reduce((sum, group) => sum + group.count, 0)
  for (const group of [...quotas].sort((a, b) => (b.share % 1) - (a.share % 1))) {
    if (!left) break
    if (group.count < group.items.length) { group.count++; left-- }
  }
  return shuffle(quotas.flatMap(group => group.items.slice(0, group.count)))
}
function startExam() {
  if (!questions.length) return
  examItems.value = pickProportional(questions, Number(examSize.value))
  examAnswers.value = {}
  examScore.value = 0
  examFinished.value = false
  examActive.value = true
  now.value = Date.now()
  examDeadline.value = now.value + Number(examMinutes.value) * 60000
}
function finishExam() {
  if (!examActive.value) return
  let score = 0
  for (const q of examItems.value) {
    const correct = hasAnswer(q, examAnswers.value[q.id]) && grade(q, examAnswers.value[q.id])
    if (correct) score += 1
    record(q.id, correct)
  }
  examScore.value = score
  examActive.value = false
  examFinished.value = true
}
function timeDisplay(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return m + ':' + s
}
function dateDisplay(ms) {
  return ms ? new Date(ms).toLocaleDateString('zh-CN') : '—'
}
function formatPercent(n, d) {
  return d ? Math.round(100 * n / d) + '%' : '—'
}
function chapterDone(number) {
  const items = [...questions, ...codingProblems, ...flashcards].filter(q => q.chapter === number)
  return {
    total: items.length,
    attempted: items.filter(q => records.value[q.id]).length,
    mastered: items.filter(q => records.value[q.id]?.lastCorrect && records.value[q.id]?.stage >= 1).length
  }
}
function exportProgress() {
  const payload = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), records: records.value }, null, 2)
  const link = document.createElement('a')
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }))
  link.href = url
  link.download = 'java-learning-progress.json'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  tip.value = 'JSON 备份已生成。请妥善保存。'
}
async function importProgress(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    if (file.size > 2_000_000) throw new Error('备份文件超过 2 MB')
    const payload = JSON.parse(await file.text())
    if (payload.version !== 1 || !payload.records || typeof payload.records !== 'object' || Array.isArray(payload.records)) {
      throw new Error('文件版本或格式不正确')
    }
    const cleaned = {}
    for (const [id, entry] of Object.entries(payload.records)) {
      if (!allIds.has(id) || !entry || typeof entry !== 'object') continue
      const attempts = Number(entry.attempts)
      const correctCount = Number(entry.correctCount)
      const wrongCount = Number(entry.wrongCount)
      const stage = Number(entry.stage)
      const lastAt = Number(entry.lastAt)
      const dueAt = Number(entry.dueAt)
      if (![attempts, correctCount, wrongCount, stage, lastAt, dueAt].every(Number.isFinite)) continue
      cleaned[id] = {
        attempts: Math.max(0, Math.floor(attempts)),
        correctCount: Math.max(0, Math.floor(correctCount)),
        wrongCount: Math.max(0, Math.floor(wrongCount)),
        stage: Math.max(-1, Math.min(3, Math.floor(stage))),
        lastCorrect: !!entry.lastCorrect,
        lastAt: Math.max(0, lastAt),
        dueAt: Math.max(0, dueAt)
      }
    }
    if (!window.confirm('导入会覆盖当前浏览器的学习记录。确认继续吗？')) return
    records.value = cleaned
    saveProgress()
    tip.value = '已导入 ' + Object.keys(cleaned).length + ' 条记录。'
  } catch (error) {
    tip.value = '导入失败：' + error.message
  } finally {
    event.target.value = ''
  }
}
</script>

<template>
  <div class="study-app">
    <div class="study-banner">
      <div>
        <p class="study-eyebrow">YOUR JAVA WORKSPACE</p>
        <h2>把每一次复习变成可见的进步</h2>
        <p>知识讲解、客观题自动批改、编程自评、闪卡、错题与考试，都在一个页面。</p>
      </div>
      <div class="study-stat-box">
        <strong>{{ mastered }} / {{ totalItems }}</strong>
        <span>已掌握的练习项</span>
      </div>
    </div>

    <div class="study-metrics">
      <div><strong>{{ chapters.length }}</strong><span>教材章节</span></div>
      <div><strong>{{ attempted }}</strong><span>已练习项目</span></div>
      <div><strong>{{ wrongItems.length }}</strong><span>曾经做错</span></div>
      <div><strong>{{ dueItems.length }}</strong><span>待复习错题</span></div>
    </div>

    <div class="study-tabs" role="tablist" aria-label="学习功能">
      <button v-for="item in tabs" :key="item.id" type="button" :class="{ active: tab === item.id }" @click="tab = item.id" role="tab" :aria-selected="tab === item.id">{{ item.label }}</button>
    </div>

    <p v-if="tip" class="study-notice" role="status">{{ tip }} <button type="button" class="study-text-button" @click="tip = ''">关闭</button></p>

    <div v-if="['learn','practice','coding','cards'].includes(tab)" class="study-picker">
      <label for="chapter-select">选择章节</label>
      <select id="chapter-select" :value="selectedChapter" @change="switchChapter($event.target.value)">
        <option v-for="ch in chapters" :key="ch.number" :value="ch.number">第 {{ Number(ch.number) }} 章 · {{ ch.title }}</option>
      </select>
    </div>

    <section v-if="tab === 'learn'" class="study-panel">
      <div class="study-panel-header"><div><span class="study-tag">章节概览</span><h3>{{ chapter.title }}</h3></div><a :href="withBase('/java/' + chapter.slug + '/')">阅读本章笔记 ↗</a></div>
      <p class="study-muted">以下是知识点填写提纲，不是教材逐字摘录。点击章节笔记页面可继续编辑和完善。</p>
      <div class="study-topic-grid">
        <div v-for="(topic, i) in chapter.topics" :key="topic" class="study-topic"><span>0{{ i + 1 }}</span><strong>{{ topic }}</strong></div>
      </div>
      <div class="study-inline-actions">
        <button type="button" class="study-primary" @click="tab = 'practice'">练习本章客观题</button>
        <button type="button" class="study-secondary" @click="tab = 'coding'">查看编程题</button>
      </div>
    </section>

    <section v-if="tab === 'practice'" class="study-panel">
      <div class="study-panel-header"><div><span class="study-tag">自动判题</span><h3>{{ chapter.title }} · 客观题</h3></div><span class="study-muted">{{ chapterQuestions.length }} 题</span></div>
      <div v-if="!chapterQuestions.length" class="study-empty">本章题库尚未填写。请编辑对应章节的 questions.json；第 2、3 章提供了原创演示题。</div>
      <article v-for="(q, index) in chapterQuestions" :key="q.id" class="study-question">
        <div class="study-question-meta"><span>题目 {{ index + 1 }}</span><span>{{ { single: '单选', multiple: '多选', truefalse: '判断', blank: '填空', output: '读代码写输出' }[q.type] }}</span><span v-if="q.id.startsWith('demo-')">DEMO</span></div>
        <h4>{{ q.prompt }}</h4>
        <pre v-if="q.code" class="study-code">{{ q.code }}</pre>
        <template v-if="q.type === 'single' || q.type === 'multiple'">
          <label v-for="option in q.options" :key="option" class="study-option">
            <input v-if="q.type === 'single'" type="radio" :name="'question-' + q.id" :value="option" v-model="answers[q.id]" :disabled="checked[q.id] !== undefined" />
            <input v-else type="checkbox" :checked="Array.isArray(answers[q.id]) && answers[q.id].includes(option)" :disabled="checked[q.id] !== undefined" @change="toggleMultiple(q.id, option, $event.target.checked, answers)" />
            <span>{{ option }}</span>
          </label>
        </template>
        <div v-else-if="q.type === 'truefalse'" class="study-inline-actions">
          <label class="study-option"><input type="radio" :name="'question-' + q.id" value="true" v-model="answers[q.id]" :disabled="checked[q.id] !== undefined" /> 正确</label>
          <label class="study-option"><input type="radio" :name="'question-' + q.id" value="false" v-model="answers[q.id]" :disabled="checked[q.id] !== undefined" /> 错误</label>
        </div>
        <textarea v-else-if="q.type === 'output'" rows="3" placeholder="逐行填写程序输出" v-model="answers[q.id]" :disabled="checked[q.id] !== undefined"></textarea>
        <input v-else class="study-answer-input" type="text" placeholder="填写答案" v-model="answers[q.id]" :disabled="checked[q.id] !== undefined" />
        <div class="study-inline-actions">
          <button v-if="checked[q.id] === undefined" type="button" class="study-primary" :disabled="!hasAnswer(q, answers[q.id])" @click="check(q)">提交答案</button>
          <button v-else type="button" class="study-secondary" @click="retry(q.id)">再做一次</button>
        </div>
        <div v-if="checked[q.id] !== undefined" class="study-result" :class="checked[q.id] ? 'study-correct' : 'study-incorrect'" role="status">
          <strong>{{ checked[q.id] ? '回答正确' : '回答错误' }}</strong>
          <p>参考答案：<span class="study-prewrap">{{ answerDisplay(q) }}</span></p>
          <p v-if="q.explanation">{{ q.explanation }}</p>
        </div>
      </article>
    </section>

    <section v-if="tab === 'coding'" class="study-panel">
      <div class="study-panel-header"><div><span class="study-tag">不执行 Java</span><h3>{{ chapter.title }} · 编程自评</h3></div><span class="study-muted">{{ chapterCoding.length }} 题</span></div>
      <p class="study-muted">在本机 JDK / IDE 编译运行。此编辑区只用于记录草稿，不具备编译和运行能力；查看参考答案后自行判断对错。</p>
      <div v-if="!chapterCoding.length" class="study-empty">本章暂无编程题。参考 ch01-intro/coding 或 ch04-classes/coding 的原创 Demo 新增 JSON。</div>
      <article v-for="q in chapterCoding" :key="q.id" class="study-question">
        <div class="study-question-meta"><span>编程题</span><span>{{ q.difficulty || '未分级' }}</span><span v-if="q.id.startsWith('demo-')">DEMO</span></div>
        <h4>{{ q.title }}</h4><p class="study-prewrap">{{ q.description }}</p>
        <label class="study-field-label" :for="'code-' + q.id">我的代码草稿（不会自动运行）</label>
        <textarea class="study-code-editor" :id="'code-' + q.id" spellcheck="false" :value="codeDrafts[q.id] ?? q.starterCode" @input="codeDrafts[q.id] = $event.target.value" rows="9"></textarea>
        <div class="study-inline-actions">
          <button type="button" class="study-secondary" @click="codeDrafts[q.id] = q.starterCode">恢复模板</button>
          <button type="button" class="study-primary" @click="codeRevealed[q.id] = !codeRevealed[q.id]">{{ codeRevealed[q.id] ? '收起参考答案' : '查看参考答案' }}</button>
        </div>
        <div v-if="codeRevealed[q.id]" class="study-reference">
          <h4>参考实现</h4><pre class="study-code">{{ q.referenceCode }}</pre>
          <p v-if="q.explanation">{{ q.explanation }}</p>
          <h4 v-if="q.testCases?.length">建议自行核对的样例</h4>
          <div v-for="(test, i) in q.testCases" :key="i" class="study-test-case"><span>用例 {{ i + 1 }}</span><p>输入/操作：{{ test.input }}</p><p>预期结果：{{ test.expectedOutput }}</p></div>
          <div class="study-inline-actions">
            <button type="button" class="study-primary" @click="record(q.id, true); tip = '已记录为做对'">我做对了</button>
            <button type="button" class="study-secondary" @click="record(q.id, false); tip = '已加入错题复习'">我做错了</button>
          </div>
        </div>
      </article>
    </section>

    <section v-if="tab === 'cards'" class="study-panel">
      <div class="study-panel-header"><div><span class="study-tag">主动回忆</span><h3>{{ chapter.title }} · 闪卡</h3></div><span class="study-muted">{{ chapterCards.length }} 张</span></div>
      <div v-if="!chapterCards.length" class="study-empty">本章闪卡待填写。可参考第 2 章 flashcards.json 的原创 Demo。</div>
      <div v-else class="study-flashcard">
        <span>卡片 {{ cardIndex % chapterCards.length + 1 }} / {{ chapterCards.length }}</span>
        <h3>{{ showCardBack ? card.back : card.front }}</h3>
        <div class="study-inline-actions">
          <button v-if="!showCardBack" type="button" class="study-primary" @click="showCardBack = true">翻面查看答案</button>
          <template v-else>
            <button type="button" class="study-secondary" @click="reviewCard(false)">还没记住</button>
            <button type="button" class="study-primary" @click="reviewCard(true)">已记住</button>
          </template>
          <button type="button" class="study-text-button" @click="nextCard">跳过 ↗</button>
        </div>
      </div>
    </section>

    <section v-if="tab === 'wrong'" class="study-panel">
      <div class="study-panel-header"><div><span class="study-tag">1 / 3 / 7 / 15 天</span><h3>错题与到期复习</h3></div><strong>{{ dueItems.length }} 条到期</strong></div>
      <p class="study-muted">曾答错的题目会保留在错题本。答错立即列为待复习；连续答对将依次安排 1、3、7、15 天后的下一次复习。</p>
      <div v-if="!wrongItems.length" class="study-empty">暂无错题。先完成一些客观题或编程自评。</div>
      <div v-for="item in wrongItems" :key="item.id" class="study-wrong-row">
        <div><strong>{{ item.q.prompt || item.q.title || item.q.front }}</strong><p>{{ chapterFor(item.q) }} · 错误 {{ item.entry.wrongCount }} 次 · {{ item.entry.dueAt <= now ? '现在可复习' : '下次 ' + dateDisplay(item.entry.dueAt) }}</p></div>
        <button type="button" class="study-secondary" @click="goTo(item.q)">去复习</button>
      </div>
    </section>

    <section v-if="tab === 'exam'" class="study-panel">
      <div class="study-panel-header"><div><span class="study-tag">仅本机评分</span><h3>限时模拟考试</h3></div><span class="study-muted">{{ questions.length }} 道可用客观题</span></div>
      <template v-if="!examActive && !examFinished">
        <p class="study-muted">按各章已收录题量的比例抽题；暂不包含编程题。若题库题量不足，则使用所有现有题目。</p>
        <div class="study-exam-controls">
          <label>目标题数 <select v-model.number="examSize"><option :value="5">5</option><option :value="10">10</option><option :value="20">20</option><option :value="30">30</option></select></label>
          <label>考试时长 <select v-model.number="examMinutes"><option :value="5">5 分钟</option><option :value="20">20 分钟</option><option :value="45">45 分钟</option><option :value="90">90 分钟</option></select></label>
        </div>
        <button type="button" class="study-primary" :disabled="!questions.length" @click="startExam">开始模拟考试</button>
      </template>
      <template v-if="examActive">
        <p class="study-timer">剩余时间：{{ timeDisplay(remainingSeconds) }} · {{ examItems.length }} 题</p>
        <article v-for="(q, i) in examItems" :key="q.id" class="study-question">
          <div class="study-question-meta"><span>第 {{ i + 1 }} 题</span><span>{{ chapterFor(q) }}</span></div><h4>{{ q.prompt }}</h4>
          <pre v-if="q.code" class="study-code">{{ q.code }}</pre>
          <template v-if="['single','multiple'].includes(q.type)">
            <label v-for="option in q.options" :key="option" class="study-option">
              <input v-if="q.type === 'single'" type="radio" :name="'exam-' + q.id" :value="option" v-model="examAnswers[q.id]" />
              <input v-else type="checkbox" :checked="Array.isArray(examAnswers[q.id]) && examAnswers[q.id].includes(option)" @change="toggleMultiple(q.id, option, $event.target.checked, examAnswers)" />
              {{ option }}
            </label>
          </template>
          <div v-else-if="q.type === 'truefalse'" class="study-inline-actions">
            <label class="study-option"><input type="radio" :name="'exam-' + q.id" value="true" v-model="examAnswers[q.id]" /> 正确</label>
            <label class="study-option"><input type="radio" :name="'exam-' + q.id" value="false" v-model="examAnswers[q.id]" /> 错误</label>
          </div>
          <textarea v-else-if="q.type === 'output'" v-model="examAnswers[q.id]" rows="3" placeholder="写出程序输出"></textarea>
          <input v-else class="study-answer-input" v-model="examAnswers[q.id]" placeholder="填写答案" />
        </article>
        <button type="button" class="study-primary" @click="finishExam">交卷并评分</button>
      </template>
      <template v-if="examFinished">
        <div class="study-exam-result"><strong>{{ examScore }} / {{ examItems.length }}</strong><span>正确率 {{ formatPercent(examScore, examItems.length) }}</span><p>成绩仅在当前浏览器显示，答题记录同步进入本地进度。</p></div>
        <div v-for="q in examItems" :key="q.id" class="study-wrong-row"><div><strong>{{ q.prompt }}</strong><p>{{ grade(q, examAnswers[q.id]) ? '✓ 正确' : '✗ 错误' }} · 参考答案：{{ answerDisplay(q) }}</p></div></div>
        <button type="button" class="study-secondary" @click="examFinished = false">返回考试设置</button>
      </template>
    </section>

    <section v-if="tab === 'progress'" class="study-panel">
      <div class="study-panel-header"><div><span class="study-tag">浏览器本地保存</span><h3>我的学习进度</h3></div><strong>{{ formatPercent(mastered, totalItems) }} 掌握率</strong></div>
      <p class="study-muted">掌握率口径：所有已收录客观题、编程题和闪卡中，最近一次作答正确且已完成至少第二个复习阶段的占比。没有内容的章节显示“待填充”。</p>
      <div v-for="ch in chapters" :key="ch.number" class="study-progress-row">
        <div><strong>{{ ch.number }} · {{ ch.title }}</strong><span>{{ chapterDone(ch.number).mastered }}/{{ chapterDone(ch.number).total || '待填充' }} 已掌握</span></div>
        <div class="study-bar"><div :style="{ width: (chapterDone(ch.number).total ? 100 * chapterDone(ch.number).mastered / chapterDone(ch.number).total : 0) + '%' }"></div></div>
      </div>
      <div class="study-backup">
        <h3>备份与迁移</h3>
        <p class="study-muted">记录存在当前浏览器 localStorage，不会同步到 GitHub，不会自动跨设备共享。换设备前请导出 JSON；导入会覆盖当前记录。</p>
        <div class="study-inline-actions">
          <button type="button" class="study-primary" @click="exportProgress">导出 JSON</button>
          <label class="study-upload">导入 JSON<input type="file" accept="application/json,.json" @change="importProgress" /></label>
        </div>
      </div>
    </section>
    <p class="study-footnote">示例数据以 demo- 标识，均为原创教学演示。网页不包含 Java 编译器，也不上传作答数据。</p>
  </div>
</template>
