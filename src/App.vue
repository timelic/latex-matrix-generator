<script setup>
import { ref, onMounted } from "vue";
const matrix = ref(new Array(30).fill(new Array(30).fill("")));
const exp = ref("");
const getMatrix = () => {
	// exp.value = "";
	// let matrix_width = Math.sqrt(matrix.value.length);
	// matrix.value.forEach((data, index) => {
	// 	exp.value += String.raw`${data}`;
	// 	exp.value += !((index + 1) % matrix_width) ? "\\\\" : " & ";
	// });
	// exp.value = String.raw`\begin{pmatrix}${exp.value}\end{pmatrix}`;
	exp.value = String.raw`\begin{bmatrix}
a_1 & a_2 & a_3 & a_4 \\
b_1 & b_2 & b_3 & b_4 \\
c_1 & c_2 & c_3 & c_4 \\
d_1 & d_2 & d_3 & d_4
\end{bmatrix} `;
	for (let i = 0; i < matrix.value.length; i++) {
		for (let j = 0; j < matrix.value[0].length; j++) {
			// if (matrix.value[i][j]) console.log(i, j);
		}
	}
};
onMounted(() => {
	getMatrix();
});

// 复制代码
let hasCopied = ref(false);
const copy = () => {
	hasCopied.value = true;
};
</script>

<template>
	<button class="test" @click="getMatrix">生成矩阵</button>
	<div class="matrix-wrap">
		<div v-for="(row, i) in matrix" class="row">
			<div v-for="(col, j) in row" class="block col">
				<input spellcheck="false" v-model="matrix[i][j]" />
			</div>
		</div>
		<div class="result">
			<vue-latex class="tex" :expression="exp" display-mode />
			<div class="code-wrap">
				<div class="code">{{ exp }}</div>
				<div class="copy-btn-wrap">
					<button class="copy-btn" @click="copy">
						{{ hasCopied ? "Copied" : "Copy" }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@1,700&family=Ubuntu+Mono&display=swap");
body,
html {
	margin: 0;
	/* overflow: auto !important; */
}
div,
span,
input {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}
:root {
	--block-width: 8rem;
	--block-padding: 0rem;
	--block-drak-color: rgb(235, 235, 235);
}
.block {
	height: var(--block-width);
	width: var(--block-width);
	flex-shrink: 0;
	padding: var(--block-padding);
}
.matrix-wrap {
	/* height: calc(10 * var(--block-width)); */
	width: calc(30 * var(--block-width));
	/* width: 100vw; */
	display: flex;
	flex-wrap: wrap;
}
.matrix-wrap input {
	background: none;
	outline: none;
	border: none;
	height: 100%;
	width: 100%;
	text-align: center;
	font-family: "Ubuntu Mono", monospace;
	font-size: 2rem;
}
.row {
	width: 100%;
	display: flex;
}

.row:nth-of-type(odd) > .col:nth-of-type(odd),
.row:nth-of-type(even) > .col:nth-of-type(even) {
	background: var(--block-drak-color);
}
.result {
	position: absolute;
	height: 30rem;
	width: 20rem;
	background: white;
	box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
		rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
	border-radius: 1rem;
	right: 20vw;
	top: 50%;
	transform: translateY(-50%);
}
.katex-display {
	margin: 0 !important;
	text-align: center;
}

.code-wrap {
	height: 60%;
}

.tex {
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
	height: 40%;
}
.code {
	margin: 1rem;
	box-shadow: inset 20px 20px 60px #d9d9d9, inset -20px -20px 60px #ffffff;
	height: calc(100% - 2rem);
	width: calc(100% - 2rem);
	border-radius: 0.5rem;
	padding: 1.5rem;
	font-family: "Ubuntu Mono", monospace;
	font-size: 1.05rem;
	white-space: pre-wrap;
	line-height: 1.25rem;
	color: rgb(9, 12, 19);
}
.copy-btn-wrap {
	position: absolute;
	bottom: 3rem;
	display: flex;
	justify-content: center;
	width: 100%;
}
.copy-btn {
	font-family: "Roboto Condensed", sans-serif;

	background: white;
	border: 1px solid rgb(235, 235, 235);
	padding: 0.5rem 1rem;
	border-radius: 1rem;
	box-shadow: rgb(50 50 93 / 25%) 0px 13px 27px -5px,
		rgb(0 0 0 / 20%) 6px 6px 17px -8px;
	cursor: pointer;
	color: rgb(107, 107, 107);
	font-size: 1.25rem;
	transition: 0.2s;
}
.copy-btn:hover {
	color: rgb(0, 183, 255);
	box-shadow: rgb(0 142 255 / 36%) 0px 15px 27px -5px,
		rgb(0 154 255 / 20%) 6px 6px 17px -8px;
}
.copy-btn:active {
	transform: scale(1.03);
	transform-origin: 50% 50%;
}
.test {
	position: fixed;
}
</style>