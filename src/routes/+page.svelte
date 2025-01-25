<script lang="ts">
	import { calculateDebx, calculateDebj } from '$lib/algorithm.svelte';
	import type { Item, LoanResult } from '$lib/LoanResult';

	let pValue = $state(100);
	let monthsValue = $state(360);
	let rateOfInterestValue = $state(5.39);

	/**
	 * 获取贷款利息
	 */
	function calculateLoanResult() {
		// P 本金(万元), months 还款期数, rateOfInterest 年利率(%)
		if (!pValue) {
			alert('请填写本金');
			return;
		}
		if (!monthsValue) {
			alert('请填写期数');
			return;
		}
		if (!rateOfInterestValue) {
			alert('请填写年利率');
			return;
		}
		const PValue = pValue * 10000,
			tmpMonthsValue = monthsValue,
			tmpRateOfInterestValue = rateOfInterestValue * 0.01;
		let loanResult = loanCalculate(PValue, tmpMonthsValue, tmpRateOfInterestValue);
		setTableValue({ debjResult: loanResult.debjResult, debxResult: loanResult.debxResult });

		// 点击计算按钮时，默认显示等额本息内容
		debxLabelClick();
	}

	/**
	 * 初始化年限下拉框
	 */
	const totalYearsList = [
		{ id: 0, label: '自定义' },
		{ id: 1, label: '1' },
		{ id: 2, label: '2' },
		{ id: 3, label: '3' },
		{ id: 4, label: '4' },
		{ id: 5, label: '5' },
		{ id: 6, label: '6' },
		{ id: 7, label: '7' },
		{ id: 8, label: '8' },
		{ id: 9, label: '9' },
		{ id: 10, label: '10' },
		{ id: 11, label: '11' },
		{ id: 12, label: '12' },
		{ id: 13, label: '13' },
		{ id: 14, label: '14' },
		{ id: 15, label: '15' },
		{ id: 16, label: '16' },
		{ id: 17, label: '17' },
		{ id: 18, label: '18' },
		{ id: 19, label: '19' },
		{ id: 20, label: '20' },
		{ id: 21, label: '21' },
		{ id: 22, label: '22' },
		{ id: 23, label: '23' },
		{ id: 24, label: '24' },
		{ id: 25, label: '25' },
		{ id: 26, label: '26' },
		{ id: 27, label: '27' },
		{ id: 28, label: '28' },
		{ id: 29, label: '29' },
		{ id: 30, label: '30' }
	];
	let selectedYear: number | undefined = $state();

	let debxTotalInterestValue: string = $state('');
	let debjTotalInterestValue: string = $state('');
	let totalInterestValue: string = $state('');
	let debxDetails: Item[] = $state([]);
	let debjDetails: Item[] = $state([]);
	/**
	 * 填充表格数据
	 * @param {LoanResult} data 数据
	 */
	function setTableValue(data: LoanResult) {
		const debj = data.debjResult;
		debjTotalInterestValue = debj.totalInterest;
		debjDetails = debj.details;

		const debx = data.debxResult;
		debxTotalInterestValue = debx.totalInterest;
		debxDetails = debx.details;
	}

	/**
	 * 构造表格行Html
	 * @param {Object} details 详情
	 * @returns 表格行Html
	 */
	function getTrHtml(details: Item[]): string {
		return details
			.map(
				(item) =>
					`<tr>
            <td>${item.n}</td>
            <td>${item.monthTotal}</td>
            <td>${item.monthMoney}</td>
            <td>${item.monthInterest}</td>
            <td>${item.restMoney}</td>
            </tr>`
			)
			.join('');
	}

	let monthsDisabled = $state(false);
	/**
	 * 年限下拉框更改事件
	 */
	const yearsSelectChange = () => {
		console.log(selectedYear);
		if (selectedYear === 0) {
			monthsDisabled = false;
			monthsValue = 0;
		} else {
			monthsDisabled = true;
			monthsValue = selectedYear === undefined ? 0 : selectedYear * 12;
		}
	};

	let debxBlockDisplay: boolean = $state(true);
	let debjBlockDisplay: boolean = $state(false);

	/**
	 * 点击等额本息时，显示等额本息，隐藏等额本金
	 */
	function debxLabelClick() {
		debxBlockDisplay = true;
		debjBlockDisplay = false;
		totalInterestValue = debxTotalInterestValue;
	}

	/**
	 * 点击等额本金时，显示等额本金，隐藏等额本息
	 */
	function debjLabelClick() {
		debxBlockDisplay = false;
		debjBlockDisplay = true;
		totalInterestValue = debjTotalInterestValue;
	}

	/**
	 * 贷款利息计算
	 * @param {number} P 本金
	 * @param {number} months 期数
	 * @param {number} rateOfInterestValue 年利率
	 */
	function loanCalculate(P: number, months: number, rateOfInterestValue: number) {
		// 月利率
		const R = rateOfInterestValue / 12;
		const debxResult = calculateDebx(P, months, R);
		const debjResult = calculateDebj(P, months, R);
		return {
			debxResult: debxResult,
			debjResult: debjResult
		};
	}
</script>

<title>贷款计算器</title>

<div class="flex-container">
	<div>
		<input name="P" type="number" bind:value={pValue} min="1" max="999" placeholder="本金(万元)" />
	</div>
	<div>
		<select name="years-select" bind:value={selectedYear} onchange={yearsSelectChange}>
			{#each totalYearsList as year}
				<option value={year.id}>
					{year.label}
				</option>
			{/each}
		</select>

		<input
			name="months"
			type="number"
			min="1"
			max="360"
			placeholder="期数(月)"
			disabled={monthsDisabled}
			bind:value={monthsValue}
		/>
	</div>
	<div>
		<input
			name="rateOfInterest"
			type="number"
			min="2.75"
			max="7"
			step="0.1"
			placeholder="年利率(%)"
			bind:value={rateOfInterestValue}
		/>
	</div>
</div>
<div>
	<button class="concrete-button" onclick={calculateLoanResult}>计算</button>
</div>

<div>总利息：{totalInterestValue}</div>

<div class="button-area">
	<button class="concrete-button" onclick={debxLabelClick}>等额本息</button>
	<button class="concrete-button" onclick={debjLabelClick}>等额本金</button>
</div>

{#if debxBlockDisplay}
	<div>
		<table>
			<thead>
				<tr>
					<th>期数</th>
					<th>月还款额</th>
					<th>每月本金</th>
					<th>每月利息</th>
					<th>剩余本金</th>
				</tr>
			</thead>
			<tbody>
				{#each debxDetails as item}
					<tr>
						<td>{item.n}</td>
						<td>{item.monthTotal}</td>
						<td>{item.monthMoney}</td>
						<td>{item.monthInterest}</td>
						<td>{item.restMoney}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if debjBlockDisplay}
	<div>
		<table>
			<thead>
				<tr>
					<th>期数</th>
					<th>月还款额</th>
					<th>每月本金</th>
					<th>每月利息</th>
					<th>剩余本金</th>
				</tr>
			</thead>
			<tbody>
				{#each debjDetails as item}
					<tr>
						<td>{item.n}</td>
						<td>{item.monthTotal}</td>
						<td>{item.monthMoney}</td>
						<td>{item.monthInterest}</td>
						<td>{item.restMoney}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	:global(body) {
		font-family: 'SF Pro SC', 'HanHei SC', 'SF Pro Text', 'Myriad Set Pro', 'SF Pro Icons',
			'PingFang SC', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
		font-size: 13px;
		background: rgba(0, 0, 0, 0.8);
		color: #f5f5f7;
	}

	input {
		width: 80px;
	}

	button {
		cursor: pointer;
		color: #f5f5f7;
	}

	table {
		border: 1px solid #f5f5f7;
		margin-top: 12px;
	}

	.button-area {
		width: 100%;
		height: 20px;
		display: flex;
		justify-content: left;
	}

	.concrete-button {
		margin: 2px;
		height: 18px;
		background: #0077ed;
		color: #f5f5f7;
		border: 0;
		border-radius: 6px;
	}

	.flex-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
</style>
