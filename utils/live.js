/** 
 * 判断分页是否还有数据
 */

export const checkPageHasMore = ({
	current,
	pageSize,
	total
}) => {
	return current * pageSize < total * 1;
}

/** 
 * 大数据统一处理
 */

export const initNum = (num) => {
	if (num * 1 > 9999) {
		return (num / 10000).toFixed(2) * 1 + 'w';
	}

	return num;
}

/** 
 * 颜色数组
 */

export const colorArray = ['#fb8615', '#f2f520', '#3eea02', '#41c3fd', '#0439eb', '#6d02de', '#e207a9', '#eb003b'];
