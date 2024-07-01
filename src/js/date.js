// 根据参数日期获取具体日期信息
export const formatDate = function (date = new Date()) {
  let year = date.getFullYear();
  let month = (date.getMonth() + 1) ;
  let day = date.getDate();
  let week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
  
  const dateInfo = {
    date: new Date(date),
    dateStr: `${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`,
    year,
    month,
    day,
    week,
    isToday:false
  }
  
  const today = new Date();
  // 判断是否为当天
  if (today.getFullYear() === year && (today.getMonth() + 1) === month && today.getDate() === day) {
    dateInfo['isToday'] = true;
  }
  return dateInfo;
};

// 根据基准日期，获取长度为dayLenth的日期数组
export const setDate = function (date = new Date(), step = 7) {
  let weekData = [];
  const week = date.getDay() - 1;
  date = getDateByDate(date, week * -1);
  for (let i = 0; i < step; i++) {
    weekData.push(formatDate(i == 0 ? date : getDateByDate(date, 1)))
  }
  return weekData;
};

// 根据基准日期获取前后某天的日期对象
export const getDateByDate = function (date = new Date(), range = 0) {
  date.setDate(date.getDate() + range);
  return date;
};

/* 
  获取以baselineDate所在周的一周、前一周、下一周的日期和星期信息(切换周期也可通过参数dayLenth自行设置)
  baselineDate: 设置的基准日期(返回的日期列表的第一个日期)
  range: 以 baselineDate 为基准日期的前后天数范围(如基准日期的range为0，需要返回前7天日期，则range为-7，后7天则range为7)
  step: 需要获取的日期信息周期天数，默认获取baselineDate所在周的一周日期信息
 */
export const getWeekDate = ({baselineDate = new Date(), range = 0, step = 7}) => {
  return setDate(getDateByDate(baselineDate, range), step);
};

