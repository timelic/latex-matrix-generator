<script setup>
import { ref, onMounted, watch } from "vue";
import _ from "lodash";
import "./assets/main.css";
const matrix = ref(
	new Array(30).fill().map(() => {
		return new Array(30);
	})
);

// 初始赋值
[
	matrix.value[1][1],
	matrix.value[1][2],
	matrix.value[1][3],
	matrix.value[2][1],
	matrix.value[2][2],
	matrix.value[2][3],
	matrix.value[3][1],
	matrix.value[3][2],
	matrix.value[3][3],
] = [
	String.raw`a_i`,
	String.raw`\vec v`,
	String.raw`\sigma`,
	String.raw`\star`,
	String.raw`A`,
	String.raw`e^x`,
	String.raw`\sqrt0`,
	String.raw`\infty`,
	String.raw`xy`,
];

// 转latex
const exp = ref("");
const exp_show = ref("");
const getMatrix = () => {
	let [up, down, left, right] = [Infinity, 0, Infinity, 0];
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
	let matrix_min = matrix.value.slice(up, down + 1).map((row) => {
		return row.slice(left, right + 1);
	});
	let core = [];
	for (let row of matrix_min) {
		core.push(
			String.raw`${row
				.map((item) => {
					return item ? String.raw`${item}` : ` `;
				})
				.join(" & ")}`
		);
	}
	exp.value = String.raw`\begin{${styleNow.value}matrix}${core.join(
		"\\\\"
	)}\end{${styleNow.value}matrix}`;
	exp_show.value = String.raw`\begin{${styleNow.value}matrix}
${core.join(
	String.raw` \\
`
)}
\end{${styleNow.value}matrix}`;
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
	matrix.value = new Array(30).fill().map(() => {
		return new Array(30);
	});
};

// 复制代码
let hasCopied = ref(false);
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();
const copy = async () => {
	await toClipboard(exp_show.value);
	hasCopied.value = true;
};

// 换风格
const showingStyles = ref(false);
const styleNow = ref("b");
const Styles = [
	{
		symbol: "",
		letter: "",
	},
	{
		symbol: "(",
		letter: "p",
	},
	{
		symbol: "[",
		letter: "b",
	},
	{
		symbol: "{",
		letter: "B",
	},
	{
		symbol: "|",
		letter: "v",
	},
	{
		symbol: "||",
		letter: "V",
	},
];
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
				/>
				<span
					class="block-clear"
					@click="matrix[i][j] = ''"
					v-if="matrix[i][j]"
				></span>
			</div>
		</div>
		<div class="result">
			<vue-latex class="tex" :expression="exp" display-mode />
			<div class="code-wrap">
				<div class="code">{{ String(exp_show) }}</div>
				<div class="copy-btn-wrap">
					<button
						class="copy-btn"
						@click="copy"
						:data-clipboard-text="copyValue"
					>
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
