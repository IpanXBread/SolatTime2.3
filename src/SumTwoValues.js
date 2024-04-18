function SumTwoValues(get1stHour, get1stMinute, get1stAmPm, get2ndHour, get2ndMinute, get2ndAmPm) {
    
  //Problem with Hour Rings In

      if (get1stHour === 12) { get1stHour = 0; } //Value for 12, turns to 0
      if (get2ndHour === 12) { get2ndHour = 0; }
    
      SumHour = parseInt(get1stHour) + parseInt(get2ndHour);
      SumLockHour = SumHour;
      SumMinute = parseInt(get1stMinute) + parseInt(get2ndMinute);
      SumLockMinute = SumMinute;
      Sum1st = parseInt(get1stHour)*60 + parseInt(get1stMinute); 
      Sum2nd = parseInt(get2ndHour)*60 + parseInt(get2ndMinute); 
        if (get1stAmPm === "PM") { SumMinute = SumMinute+720; Sum1st = Sum1st+720; get1stHour = get1stHour + 12; }
        if (get2ndAmPm === "PM") { SumMinute = SumMinute+720; Sum2nd = Sum2nd+720; get2ndHour = get2ndHour + 12; }
        if (get1stAmPm === "-PM") { SumMinute = SumMinute-720; Sum1st = Sum1st-720; get1stHour = get1stHour - 12; }
        if (get2ndAmPm === "-PM") { SumMinute = SumMinute-720; Sum2nd = Sum2nd-720; get2ndHour = get2ndHour - 12; }
    
      SumValue = parseInt(SumHour)*60 + parseInt(SumMinute);
      
      TotalHour = SumHour;
      SumAmPm = "AM"; // -------- Initial either should be "AM" or take get1stSumAmPm as the initial value
    
      //SHIFTING (Shifting is different because the Minute value accepts -59 to 59, while SumMinute needs to be between 0~59 only)
    
          HourForShifting = SumHour;
          MinuteForShifting = SumMinute;
          while (MinuteForShifting <= -60) { //Minute less than 60, convert into Hour-1
            MinuteForShifting = MinuteForShifting + 60;
            HourForShifting = HourForShifting - 1;
          }
          while (MinuteForShifting >= 60) { //Minute more than 60, convert into Hour+1
            MinuteForShifting = MinuteForShifting - 60;
            HourForShifting = HourForShifting + 1;
          }
      
      //RINGS IN...
      if (Sum2nd > Sum1st) {
        RingsInHour = 24 - (get2ndHour - get1stHour);  
        RingsInMinute = get1stMinute - get2ndMinute; 
        if (RingsInMinute < 0)   { RingsInMinute = RingsInMinute + 60; RingsInHour = RingsInHour - 1; }
        if (RingsInMinute >= 60) { RingsInMinute = RingsInMinute - 60; RingsInHour = RingsInHour + 1; } 
      } else {
        RingsInHour = get1stHour - get2ndHour;
        RingsInMinute = get1stMinute - get2ndMinute;
        if (RingsInMinute >= 60) { RingsInMinute = RingsInMinute - 60; RingsInHour = RingsInHour + 1;}
        if (RingsInMinute < 0)   { RingsInMinute = RingsInMinute + 60; RingsInHour = RingsInHour - 1;}
      }
                                                                          //console.log("It will rings in about:" + RingsInHour + " hour and " + RingsInMinute + " minute.");
    
      //CLOCK
          while (SumMinute < 0) { //Minute less than 0, convert into Hour-1
            SumMinute = SumMinute + 60;
            SumHour = SumHour - 1;
          }
    
          while (SumMinute >= 60) { //Minute over 60, convert into Hour+1
            SumMinute = SumMinute - 60;
            SumHour = SumHour + 1; 
          }
    
          while (SumHour>12) //Getting the correct AM PM
          {
            SumHour = SumHour - 12;
            if (SumAmPm === "AM") { SumAmPm = "PM" }
            else if (SumAmPm === "PM") { SumAmPm = "AM" }
          }
  
      //Calculate Total Seconds
      SumSeconds = parseInt(SumLockHour * 3600) + parseInt(SumLockMinute * 60);
    
      return {calcHour: SumHour, calcMinute: SumMinute, calcShiftingMinute: MinuteForShifting, calcShiftingHour: HourForShifting, calcAmPm: SumAmPm, calcTotalHour: TotalHour, calcTotalMinute : SumValue, calcMinuteInDoubleDigitValue: `${SumMinute < 10 ? "0" + SumMinute : SumMinute}`, calcHourRingsIn: RingsInHour, calcMinuteRingsIn: RingsInMinute, calcTotalSeconds: SumSeconds};
    }

export { SumTwoValues };