import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs';
import { DataService, BudgetItem } from '../data/data.service';

declare const Chart: any;
declare const d3: any;

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.scss']
})
export class HomepageComponent implements AfterViewInit, OnDestroy {
  private sub?: Subscription;
  private chartRef: any | null = null;

  constructor(private data: DataService) {}

  ngAfterViewInit(): void {
    this.sub = this.data.loadIfEmpty().subscribe({
      next: () => {
        const items = this.data.snapshot ?? [];
        this.renderCharts(items);
      },
      error: err => console.error('Failed to load /budget', err),
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.chartRef) { this.chartRef.destroy(); this.chartRef = null; }
  }

  private renderCharts(items: BudgetItem[]) {
    if (!items || items.length === 0) return;
    this.renderDoughnut(items);
    this.renderD3(items);
  }

  private renderDoughnut(items: BudgetItem[]) {
    const labels = items.map(i => i.title);
    const values = items.map(i => i.budget);

    const palette = [
      '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19',
      '#4bc0c0', '#9966ff', '#c9cbcf', '#2ecc71',
      '#e74c3c', '#9b59b6'
    ];

    const canvas = document.getElementById('myChart') as HTMLCanvasElement | null;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    if (this.chartRef) this.chartRef.destroy();
    this.chartRef = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data: values, backgroundColor: palette }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  private renderD3(items: BudgetItem[]) {
    const svg = d3.select('#d3Chart');
    if (!svg.node()) return;

    const width: number = +svg.attr('width') || 500;
    const height: number = +svg.attr('height') || 300;
    const margin = { top: 10, right: 10, bottom: 30, left: 35 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(items.map((d: BudgetItem) => d.title))
      .range([0, w])
      .padding(0.25);

    const maxY = (d3.max(items, (d: BudgetItem) => d.budget) ?? 0);
    const y = d3.scaleLinear()
      .domain([0, maxY])
      .nice()
      .range([h, 0]);

    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));

    g.selectAll('rect')
      .data(items)
      .join('rect')
      .attr('x', (d: BudgetItem) => x(d.title)!)
      .attr('y', (d: BudgetItem) => y(d.budget))
      .attr('width', x.bandwidth())
      .attr('height', (d: BudgetItem) => h - y(d.budget));
  }
}
