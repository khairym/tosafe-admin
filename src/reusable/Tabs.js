import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, } from 'reactstrap';
import classnames from 'classnames';

export default ({ data, titleStyle = {}, bodyStyle = {}, selectedTabIndex = '0' }) => {
    const [activeTab, setActiveTab] = useState(selectedTabIndex);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    return (
        <div>
            <Nav tabs>
                {
                    data.map(elm => elm.label).map((tL, ind) =>
                        <NavItem key={ind}>
                            <NavLink
                                className={classnames({ active: activeTab === ind.toString() })}
                                onClick={() => { toggle(ind.toString()); }}
                                style={titleStyle}
                            >
                                {tL}
                            </NavLink>
                        </NavItem>
                    )
                }
            </Nav>
            <TabContent activeTab={activeTab}>
                {
                    data.map(elm => elm.body).map((tB, ind) =>
                        <TabPane
                            key={ind}
                            tabId={ind.toString()}
                            style={bodyStyle}
                        >
                            {tB}
                        </TabPane>
                    )
                }
            </TabContent>
        </div>
    );
};