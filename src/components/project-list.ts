import { autobind } from "../decorator/autobind.js";
import { DragtTarger } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project-state.js";
import { Component } from "./base-components.js";
import { ProjectItem } from "./project-items.js";

export class ProjectList extends Component<HTMLDivElement, HTMLElement>
    implements DragtTarger {
    assignedProject: Project[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`);

        this.assignedProject = [];
        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent): void {
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }        
    }

    @autobind
    dropHandler(event: DragEvent): void {
        const prjId = event.dataTransfer!.getData('text/plain');        
        projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }

    @autobind
    dragLeaveHandler(_: DragEvent): void {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    renderProjects() {

        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';

        for (const prjItem of this.assignedProject) {
            //create manualy

            // const listItem = document.createElement('li');
            // listItem.textContent = prjItem.title;
            // listEl.appendChild(listItem);

            //create as object class
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }
    }

    configure(): void {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

        projectState.addListener((projects: Project[]) => {
            const relevantProject = projects.filter(prj => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProject = relevantProject;
            this.renderProjects();
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase()+ ' PROJECTS';
    }
}