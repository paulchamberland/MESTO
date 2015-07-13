/* New function to center some treatment.
 * @author : jonathan-lefebvregithub@outlook.com
 */
(function() {
    Date.prototype.toYMD = function() {
        var year, month, day;
        year = String(this.getFullYear());
        month = String(this.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        day = String(this.getDate());
        if (day.length == 1) {
            day = "0" + day;
        }
        
        return (isNaN(year) || isNaN(month) || isNaN(day)) ? "" : year + "-" + month + "-" + day;
    }
})();
(function() {
    Date.prototype.toDMY = function() {
        var year, month, day;
        year = String(this.getFullYear());
        month = String(this.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        day = String(this.getDate());
        if (day.length == 1) {
            day = "0" + day;
        }
        
        return (isNaN(year) || isNaN(month) || isNaN(day)) ? "" : day + "-" + month + "-" + year;
    }
})();
(function() {
    Date.parseToDMY = function(p_date) {
        var result = "";
        
        if (p_date != null && p_date != "undefined" && p_date != "") {
            var tmp = p_date.split('-');
            if (tmp.length == 3 && tmp[0].length == 4 && tmp[0] != "0000") {
                result = String(tmp[2]+"-"+tmp[1]+"-"+tmp[0]);
            }
            else if (tmp.length == 3 && tmp[2].length == 4 && tmp[2] != "0000") {
                result = String(tmp[0]+"-"+tmp[1]+"-"+tmp[2]);
            }
        }
       
        return result;
    }
})();