import { Fragment } from 'react'
import { Row, Col } from "reactstrap"

// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
    PaginationProvider, PaginationListStandalone,
    SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import "./datatables.scss"



export default ({ data, columns, order = 'asc' }) => {
    const defaultSorted = [{
        dataField: 'id',
        order: order
    }];

    const page = 1
    const sizePerPage = 10

    // Select All Button operation
    const selectRow = {
        mode: 'checkbox'
    }

    const { SearchBar } = Search;

    return (
        <PaginationProvider
            pagination={paginationFactory({
                sizePerPage: 10,
                totalSize: data.length,
                custom: true,
            })}
            keyField='id'
            columns={columns}
            data={data}
        >
            {({ paginationProps, paginationTableProps }) => (
                <ToolkitProvider
                    keyField='id'
                    columns={columns}
                    data={data}
                    search
                >
                    {toolkitProps => (
                        <Fragment>

                            <Row className="mb-2">
                                <Col md="4">
                                    <div className="search-box me-2 mb-2 d-inline-block">
                                        <div className="position-relative">
                                            <SearchBar
                                                {...toolkitProps.searchProps}
                                                placeholder="Buscar"
                                            />
                                            <i className="search-box chat-search-box" />
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col xl="12">
                                    <div className="table-responsive">
                                        <BootstrapTable
                                            keyField={"id"}
                                            responsive
                                            bordered={false}
                                            striped={false}
                                            defaultSorted={defaultSorted}
                                            // selectRow={selectRow}
                                            classes={
                                                "table align-middle table-nowrap"
                                            }
                                            headerWrapperClasses={"thead-light"}
                                            {...toolkitProps.baseProps}
                                            {...paginationTableProps}
                                        />

                                    </div>
                                </Col>
                            </Row>

                            <Row className="align-items-md-center mt-30">
                                <Col className="inner-custom-pagination d-flex">
                                    <div className="d-inline">
                                        <SizePerPageDropdownStandalone
                                            {...paginationProps}
                                        />
                                    </div>
                                    <div className="text-md-right ms-auto">
                                        <PaginationListStandalone
                                            {...paginationProps}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Fragment>
                    )
                    }
                </ToolkitProvider>
            )
            }</PaginationProvider>
    )
}