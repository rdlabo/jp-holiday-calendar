import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { differenceInDays } from 'date-fns'

interface HolidayResponse {
  mainText: string
  titleText: string
  redirectionUrl?: string
  uuid?: string
  updateDate?: string
}
interface Holiday {
  mainText: string
  titleText: string
}
interface UpcomingHoliday {
  date: string
  day: string
  name: string
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  holiday: Holiday = {
    mainText: '',
    titleText: 'Loading...',
  }
  upcomingHoliday: UpcomingHoliday = {
    date: '',
    day: '',
    name: ''
  }
  holidays: UpcomingHoliday[] = []
  differenceInDay: number = -1
  constructor(public http: HttpClient) {}
  ionViewWillEnter() {
    this.getNextHoliday()
  }
  doRefresh(event) {
    this.getNextHoliday()
    event.target.complete()
  }
  getNextHoliday() {
    this.http.get('https://g0yjev205h.execute-api.us-east-1.amazonaws.com/production/holiday/jp/upcoming')
      .subscribe((data: HolidayResponse[]) => {
        if (data.length < 1) {
          this.holiday = {
            titleText: '',
            mainText: '直近での祝祭日予定が見つかりませんでした'
          }
          return
        }
        this.holiday = data[0]
      })
    this.http.get('https://g0yjev205h.execute-api.us-east-1.amazonaws.com/production/holiday/jp/all')
      .subscribe((data: UpcomingHoliday[]) => {
        if (data.length < 1) return
        this.holidays = data
        this.upcomingHoliday = data[0]
        this.differenceInDay = differenceInDays(new Date(this.upcomingHoliday.date), new Date())
      })
  }
}
