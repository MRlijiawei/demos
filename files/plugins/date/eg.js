var plugin = new PickerCascade({
    datepickerBeginDate: 'datepickerBeginDate',
    datepickerEndDate: 'datepickerEndDate',
    datepickerYear: 'datepickerYear',
    datepickerMonth: 'datepickerMonth'
});
$('.date-picker').datepicker().on('changeDate',gotoDate);

function gotoDate(ev){
   plugin._gotoDate(ev);
}
function changeTime(){
   plugin._changeTime();
}