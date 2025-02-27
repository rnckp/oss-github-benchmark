import { TodoInstitution } from './types';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Institution,
  InstitutionSumary as InstitutionSummary,
  Repository,
  User,
} from './types';
import { shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dimensionOptions = this.http
    .get<Metric[]>('assets/options.json')
    .pipe(shareReplay(1));

  constructor(private http: HttpClient) {}
  private institutionData = null;

  async createNewTodoInstitution(institution: TodoInstitution) {
    console.log(institution);
    return await this.http
      .post<TodoInstitution>(`${environment.api}api/institution`, { institution })
      .toPromise();
  }

  async loadSingleInstitution(config: { name: string }): Promise<Institution> {
    this.institutionData = await this.http
      .get<Institution>(`${environment.api}api/singleInstitution`, {
        params: config,
      })
      .toPromise();
    return this.institutionData;
  }

  async loadInstitutionSummaries(config: {
    search?: string;
    sort?: string;
    direction?: 'ASC' | 'DESC';
    page?: string;
    count?: string;
    includeForks?: string;
    sector?: string[];
  }): Promise<{
    institutions: InstitutionSummary[];
    total: number;
    sectors: { [key: string]: number };
  }> {
    this.institutionData = await this.http
      .get<InstitutionSummary[]>(`${environment.api}api/paginatedInstitutions`, {
        params: config,
      })
      .toPromise();
    return this.institutionData;
  }

  async loadLatestUpdate() {
    let latestUpdate = await this.http
      .get<{ updatedDate: string }>(`${environment.api}api/latestUpdate`, {})
      .toPromise();
    return latestUpdate.updatedDate;
  }

  async loadRepoData(config: {
    search?: string;
    sort?: string;
    direction?: 'ASC' | 'DESC';
    page?: string;
    count?: string;
    includeForks?: string;
  }) {
    const repoData = await this.http
      .get<{
        repositories: Repository[];
        total: number;
      }>(`${environment.api}api/paginatedRepositories`, {
        params: config,
      })
      .toPromise();
    return repoData;
  }

  async loadRepoDataDetailView(config: {
    search?: string;
    sort?: string;
    direction?: 'ASC' | 'DESC';
    page?: string;
    count?: string;
    includeForks?: string;
  }) {
    const repoData = await this.http
      .get<{
        repositories: Repository[];
        total: number;
      }>(`${environment.api}api/institutionRepositories`, {
        params: config,
      })
      .toPromise();
    return repoData;
  }

  async loadUserData(config: {
    search: string;
    sort: string;
    direction: 'ASC' | 'DESC';
    page: string;
    count: string;
  }) {
    const userData = await this.http
      .get<{
        users: User[];
        total: number;
      }>(`${environment.api}api/paginatedUsers`, {
        params: config,
      })
      .toPromise();
    return userData;
  }
}

export interface Metric {
  key: string;
  friendly_name: string;
  description: string;
}
