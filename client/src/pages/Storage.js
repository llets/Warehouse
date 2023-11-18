import React from "react";
import styles from '../styles.module.scss';

const Storage = () => {
    return(
    <div>
        <div class="button-toolbar" role="toolbar">
        <div className={["btn-group  ",styles.matrix].join(' ')} role="group" aria-label="Three Column Button Matrix" >
            <div>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning border p-2" ></button>
            </div>
            <div>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning gx-3 p-2"></button>
            </div>
            <div>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning gx-3 p-2"></button>
            </div>
            <div>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning gx-3 p-2"></button>
            </div>
            <div>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning p-2"></button>
            </div>
            <div>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning p-2"></button>
            </div>
            <div>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning p-2"></button>
            </div>
            <div>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning p-2"></button>
            <div>
            </div>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning p-2"></button>
            </div>
            <div>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning p-2"></button>
            </div>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning p-2"></button>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning p-2"></button>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning p-2"></button>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning p-2"></button>
            <button type="button" class="btn btn-sm btn-default col-sm-4 bg-warning p-2"></button>
            </div>
        </div>
    </div>
    );
}
export default Storage;