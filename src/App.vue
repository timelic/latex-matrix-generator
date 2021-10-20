<script setup>
import { ref, onMounted, watch } from "vue";
import _ from "lodash";
import "./assets/main.css";
import { Styles, initialValueMap } from "./data";

const matrix = ref(new Array(30).fill().map(() => new Array(30)));

// 初始赋值
for (let index = 0; index < initialValueMap[0].length; index++) {
	let [i, j] = initialValueMap[0][index];
	matrix.value[i][j] = initialValueMap[1][index];
}

// 转latex
const exp = ref("");
const exp_show = ref("");
let hasCopied = ref(false); // 是否已经被复制
let [up, down, left, right] = [Infinity, 0, Infinity, 0];
const findBorder = () => {
	// 找矩阵的左右前后
	[up, down, left, right] = [Infinity, 0, Infinity, 0];
	for (let i = 0; i < matrix.value.length; i++) {
		for (let j = 0; j < matrix.value[0].length; j++) {
			if (matrix.value[i][j]) {
				up = i < up ? i : up;
				down = i > down ? i : down;
				left = j < left ? j : left;
				right = j > right ? j : right;
			}
		}
	}
};
const getMatrix = () => {
	// 找矩阵的左右前后
	findBorder();
	// 获取最小矩阵
	let matrix_min = matrix.value
		.slice(up, down + 1)
		.map((row) => row.slice(left, right + 1));
	// 生成无前后缀的latex代码
	let core = [];
	for (let row of matrix_min) {
		core.push(
			String.raw`${row
				.map((item) => (item ? String.raw`${item}` : ` `))
				.join(" & ")}`
		);
	}
	// 生成完整latex和展示的代码
	exp.value = String.raw`\begin{${styleNow.value}matrix}${core.join(
		"\\\\"
	)}\end{${styleNow.value}matrix}`;
	exp_show.value = String.raw`\begin{${styleNow.value}matrix}
${core.join(
	String.raw` \\
`
)}
\end{${styleNow.value}matrix}`;
	// copy复原
	hasCopied.value = false;
};

watch(
	() => _.cloneDeep(matrix.value),
	() => {
		getMatrix();
	}
);

onMounted(() => {
	getMatrix();
});

// 清空
const clear = () => {
	matrix.value = new Array(30).fill().map(() => new Array(30));
};

// 复制代码
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();
const copy = async () => {
	await toClipboard(exp_show.value);
	hasCopied.value = true;
};

// 换风格
const showingStyles = ref(false);
const styleNow = ref("b");
watch(styleNow, () => {
	getMatrix();
});

// 跳转github
const about = () => {
	window.open("https://github.com/timelic/latex-matrix-generator", "_blank");
};

// 实现文字宽度自适应
const fontWidth = (text) => {
	if (text) {
		if (text.length > 8) {
			return `font-size: calc(var(--block-width) / ${text.length} * 2)`;
		}
	}
};

const inputMatrix = new Array(30).fill(null).map(() => new Array(30));

// 回车跳到下一个
const toNextRow = (row, col) => {
	// 但是，这样子就是行
	inputMatrix[row + 1][left].focus();
};
</script>

<template>
	<!-- <img src="./assets/LaTeX_logo.svg" id="logo" /> -->
	<div class="matrix-wrap">
		<div v-for="(row, i) in matrix" :key="i" class="row">
			<div v-for="(col, j) in row" :key="100 * i + j" class="block col">
				<input
					spellcheck="false"
					v-model="matrix[i][j]"
					:style="fontWidth(matrix[i][j])"
					@keyup.enter="toNextRow(i, j)"
					:ref="
						(el) => {
							if (el) inputMatrix[i][j] = el;
						}
					"
				/>
				<span
					class="block-clear"
					@click="matrix[i][j] = null"
					v-if="matrix[i][j]"
				></span>
			</div>
		</div>
		<div class="result">
			<vue-latex class="tex" :expression="exp" display-mode />
			<div class="code-wrap">
				<div class="code">{{ String(exp_show) }}</div>
				<div class="copy-btn-wrap">
					<button class="copy-btn" @click="copy">
						{{ hasCopied ? "Copied" : "Copy" }}
					</button>
				</div>
			</div>
		</div>
	</div>
	<div class="btn-groups">
		<button class="clear" @click="clear"></button>
		<button
			class="options"
			@click="showingStyles = !showingStyles"
		></button>
		<button class="about" @click="about"></button>
		<div class="matrix_style" v-if="showingStyles">
			<button v-for="item in Styles" @click="styleNow = item.letter">
				{{ item.symbol }}
			</button>
		</div>
	</div>
</template>

<style></style>
