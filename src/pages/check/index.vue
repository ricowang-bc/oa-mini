<template>
    <view class="check">
        <view class="check-item">
            <view class="u-flex flex-row-bewteen" style="justify-content: space-between;">
                <view class="u-card__head--left u-flex u-line-1 ">
                    <u-avatar mode="square" size="mini"></u-avatar>          
                    <template v-if="prefix!='FLDC'">
                        <text style="font-size:28rpx;color:#909399;margin-left: 20rpx;"> {{ flow.creatorName  }}的{{getPrefix(flow.prefix) }}</text>
                    </template>
                    <template v-else>
                        <view class="u-line-2" style="font-size:26rpx;color:#909399;margin-left: 20rpx;">
                             <view > 邯郸市农业综合行政执法支队</view>
                             <view > （市动物卫生监督所）收文呈办单</view>
                        </view>
                       
                    </template>
                </view>
                <view v-if="flow.status!=undefined">
                    <template v-if="prefix!='FLDC'">
                        <u-tag size="small" :type="getStatus(flow.status).type" :text="getStatus(flow.status).text" />
                    </template>
                    <template v-else>
                        <u-tag size="small" :type="getState(flow).type" :text="getState(flow).text" />
                    </template>
                </view>
            </view>
        </view>
        <view style="padding-bottom:200rpx">
            <leave-item v-if="prefix=='FLQJ'" :flow="flow" />
            <trip-item v-if="prefix=='FLCC'" :flow="flow" />
            <car-item v-if="prefix=='FLYC'" :flow="flow" />
            <meet-item v-if="prefix=='FLMR'" :flow="flow" />
            <seal-item v-if="prefix=='FLYZ'" :flow="flow" />
            <report-item v-if="prefix=='FLRR'" :flow="flow" />
            <return-item v-if="prefix=='FLHC'" :flow="flow" />
            <template v-if="prefix=='FLDC'" >
                <doc-item :flow="flow" />
                <u-cell-group v-if="user.role?.level== 4 && !readonly">
                    <u-cell-item  title="选择分办人员" @click="goPeople"/>
                    <view style="margin-bottom: 100rpx;padding:20rpx; 30rpx">
                        <template v-for="(donner,i) in donners" :key="i">
                            <u-tag  class="mb-20" style="margin-right: 20rpx; display: inline-block;"  size="small" type="info" :text="donner.name" />
                        </template>                     
                    </view>
                </u-cell-group>
            </template>
            <u-card title="审批意见" margin="30rpx 0" :body-style="{padding:'0'}">
                <template #body>
                    <u-cell-group >
                    <template v-for="(step,index2) in flow.steps" :key="index2" >
                        <template v-if="step.publishTime">
                            <u-cell-item :title="step.userName" :label="step.roleName" :arrow="false" :value="step.content"/>
                        </template>
                    </template>
                </u-cell-group>
                </template>
               
            </u-card>
        </view>
        <view class="bottom-fix" v-if="!readonly">
            <template v-if="prefix!='FLDC'">
                <view style="padding-bottom:20rpx;border-bottom:1rpx solid #ddd;background: #FFF;">
                    <u-input v-model="remark"  :border="true" placeholder="填写意见"/>
                </view>
                <view class="u-flex row-end" style="padding-top:20rpx"  v-if="prefix!='FLMR'">
                    <u-button @click="reject" type="error" size="medium" style="margin-right: 20rpx;">驳回</u-button>
                    <u-button @click="publish" type="primary" size="medium">同意</u-button>
                </view>
                <view class="u-flex row-end" style="padding-top:20rpx" v-else>
                    <u-button type="primary" size="medium" @click="publish">签字</u-button>
                </view>
            </template>
            <template v-else> <!-- 文档传阅 -->
                <template v-if="(flow as DocViewModel).checkers?.includes(user.name!)" >
                    <view style="padding-bottom:20rpx;border-bottom:1rpx solid #ddd;background: #FFF;">
                        <u-input v-model="remark"  :border="true" placeholder="填写意见"/>
                    </view>
                    
                    <view class="u-flex row-end" style="padding-top:20rpx;background: #FFF;" >
                    
                        <u-button :disabled="!flow.canPublish" v-if="user.role?.level==1" @click="reject" type="error" size="medium" style="margin-right: 20rpx;">驳回</u-button>
                        <u-button :disabled="!flow.canPublish" v-if="user.role?.level!= 4" @click="publish" type="primary" size="medium">同意</u-button>
                        <u-button :disabled="!flow.canPublish" v-if="user.role?.level== 4"  @click="publish2(false)" type="primary" size="medium">同意并分办</u-button>
                    </view>
                </template>
                <template v-else>
                    <!-- <view class="u-flex u-row-between" style="padding-top:20rpx;background: #FFF;" > -->
                        <u-button v-if="(flow as DocViewModel).donners?.includes(user.name!) && flow.steps?.filter(s=>s.userID==user.id && s.event!=null).length==0" @click="Do()"  type="primary" size="medium">知晓</u-button>
                        <u-button v-if="(flow as DocViewModel).state==2 && user.role?.code =='DOC-ARCHIVE'" @click="Archive()"  type="success" size="medium">归档</u-button>
                    <!-- </view> -->
                </template>
                
            </template>
        </view>
    </view>
    <u-modal v-model="showModel" content="未选择分办人员，确认提交吗？" :show-cancel-button="true" @cancel="showModel=false" @confirm="publish2(true)"></u-modal>
</template>
<script lang="ts" setup>
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref,computed } from 'vue';
import type {  DocViewModel, WorkViewModel,UserViewModel } from '@/api/admin/gen/typings';
import MeetItem from './components/meet.vue'
import SealItem from './components/seal.vue'
import LeaveItem from './components/leave.vue'
import CarItem from './components/car.vue'
import TripItem from './components/trip.vue'
import ReportItem from './components/report.vue'
import DocItem from './components/doc.vue'
import ReturnItem from './components/return.vue'
import $api from '@/api';
const flow = ref<WorkViewModel>({} as WorkViewModel);
const remark = ref<string>('');
const readonly = ref<boolean>(false);
const showModel = ref<boolean>(false);

onShow(async() => {
    // let check = uni.getStorageSync('check');
    // flow.value = {...check};
    await getFlow();
    donners.value = uni.getStorageSync("donners") as UserViewModel[]
});
const user : UserViewModel = uni.getStorageSync("user") as UserViewModel;
const donners = ref<UserViewModel[]>([]);
const prefix = computed(() => {
    if (flow.value)
        return flow.value.prefix;
    return '';
});
const goPeople = ()=>{
    if(!flow.value.canPublish)
        return;
    if(readonly.value)
        return;
    uni.navigateTo({
        url: `/pages/people`
    });
}

const getFlow = async () => {
    uni.showLoading({title: '加载中' });
    let page:any = getCurrentPages()[getCurrentPages().length - 1];
    const id = page.options.id;
    const prefix = page.options.prefix;
    readonly.value = page.options.type=='1' || page.options.type=='2';
    let res :any = null;
    if(prefix != 'FLDC'){
        if(prefix == 'FLMR'){
            res = await $api.Meet.Get({id})
        }
        if(prefix == 'FLYZ'){
            res = await $api.WorkSeal.Get({id})
        }
        if(prefix == 'FLCC'){
            res = await $api.Trip.Get({id})
        }
        if(prefix == 'FLRR'){
            res = await $api.Report.Get({id})
        }
        if(prefix == 'FLQJ'){
            res = await $api.Leave.Get({id})
        }
        if(prefix == 'FLYC'){
            res = await $api.Che.Get({id})
        }
        if(prefix == 'FLHC'){
            res = await $api.Return.Get({id})
        }
        if(res){
            flow.value = res;
        }
    }else{
        flow.value = uni.getStorageSync('check');
        // uni.removeStorageSync('check');
    }
    uni.hideLoading();
}


const reject = async () => {
    if (remark.value == '') {
        uni.showToast({
            title: '驳回时，请填写意见',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    uni.showLoading({title: '提交中' });
    const prefix = flow.value.prefix;
    const flowID:any = flow.value.id;
    const body = {
        id:flow.value.id,
        remark:remark.value
    }
   
    let res :any = null;
    if(prefix == 'FLYZ'){
        res = await $api.WorkSeal.Reject({flowID},body);
    }
    if(prefix == 'FLCC'){
        res = await $api.Trip.Reject({flowID},body);
    }
    if(prefix == 'FLRR'){
        res = await $api.Report.Reject({flowID},body);
    }
    if(prefix == 'FLQJ'){
        res = await $api.Leave.Reject({flowID},body);
    }
    if(prefix == 'FLYC'){
        res = await $api.Che.Reject({flowID},body);
    }
    if(prefix == 'FLDC'){
        res = await $api.Doc.Reject({flowID},body);
    }
    if(prefix == 'FLHC'){
        res = await $api.Return.Reject({flowID},body);
    }

    if(res){
        uni.showToast({
            title: '审批已驳回',
            icon: 'success',
            duration: 2000
        });
        if(prefix == 'FLDC'){
            uni.removeStorageSync('check');
            uni.removeStorageSync('donners');
            uni.switchTab({
                url: '/pages/doc'
            })
        }else{
            uni.switchTab({
                url: '/pages/list'
            })
        }
        
    }
    uni.hideLoading();
}

const publish = async () => {
    uni.showLoading({title: '提交中' });
    const prefix = flow.value.prefix;
    const flowID:any = flow.value.id;
    const body = {
        id:flow.value.id,
        remark:remark.value
    }
   
    let res :any = null;
     if(prefix == 'FLMR'){
        res = await $api.Meet.Publish({flowID},body);
    }
    if(prefix == 'FLYZ'){
        res = await $api.WorkSeal.Publish({flowID},body);
    }
    if(prefix == 'FLCC'){
        res = await $api.Trip.Publish({flowID},body);
    }
    if(prefix == 'FLRR'){
        res = await $api.Report.Publish({flowID},body);
    }
    if(prefix == 'FLQJ'){
        res = await $api.Leave.Publish({flowID},body);
    }
    if(prefix == 'FLYC'){
        res = await $api.Che.Publish({flowID},body);
    }
    if(prefix == 'FLDC'){
        res = await $api.Doc.Publish({flowID},body);
    }
    if(prefix == 'FLHC'){
        res = await $api.Return.Publish({flowID},body);
    }

    if(res){
        uni.showToast({
            title: '审批完成',
            icon: 'success',
            duration: 2000
        });
        if(prefix == 'FLDC'){
            uni.removeStorageSync('check');
            uni.removeStorageSync('donners');
            uni.switchTab({
                url: '/pages/doc'
            })
        }else{
            uni.switchTab({
                url: '/pages/list'
            })
        }
        
    }
    uni.hideLoading();
}

const Archive = async ()=>{
    uni.showLoading({title: '提交中' });
    let res = await $api.Doc.Archive({id:flow.value.id!});
    if(res){
        uni.showToast({
            title: '归档成功',
            icon: 'success',
            duration: 2000
        });
        uni.switchTab({
            url: '/pages/doc'
        })
    }
    uni.hideLoading();
}

 const Do= async () =>{
    uni.showLoading({title: '提交中' });
    const prefix = flow.value.prefix;
    const flowID:any = flow.value.id;
    const body = {
        id:flow.value.id,
        remark:remark.value,
    }
    let res = await $api.Doc.Do({flowID},body);
    if(res){
        uni.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
        });
        uni.switchTab({
            url: '/pages/doc'
        })
    }
    uni.hideLoading();
}

const publish2= async (isSubmit:boolean) =>{
    if ((!donners.value || donners.value.length==0) && !isSubmit){
        showModel.value = true;
        return;
    };
    console.log('123123');
    uni.showLoading({title: '提交中' });
    const prefix = flow.value.prefix;
    const flowID:any = flow.value.id;
    const body = {
        id:flow.value.id,
        remark:remark.value,
        donners:(!donners.value || donners.value.length==0)?[]:donners.value.map((item:any)=>item.id)
    }
    let res = await $api.Doc.Publish2({flowID},body);
    if(res){
        uni.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
        });
        uni.removeStorageSync('check');
        uni.removeStorageSync('donners');
        uni.switchTab({
            url: '/pages/doc'
        })
    }
    uni.hideLoading();
}

const getPrefix = (prefix:any)=>{
    if (prefix == 'FLMR'){
        return '会议纪要';
    }
    if (prefix == 'FLYZ'){
        return '用章申请';
    }
    if (prefix == 'FLCC'){
        return '出差申请';
    }
    if (prefix == 'FLRR'){
        return '工作汇报';
    }
    if (prefix == 'FLQJ'){
        return '请假申请';
    }
    if (prefix == 'FLYC'){
        return '用车申请';
    }
     if (prefix == 'FLDC'){
        return '用车申请';
    }
     if (prefix == 'FLHC'){
        return '还车申请';
    }
    return '审批申请';
}


const getStatus = (status:any)=>{
    if (status == 0 || !status){
        return {
            text:'待审批',
            type:'warning'
        };
    }
    if (status == 1){
        return {
            text:'流程中',
            type:'warning'
        };
    }
    if (status == 2){
        return {
            text:'审批通过',
            type:'success'
        };
    }
    if (status == 3){
        return {
            text:'被驳回',
            type:'error'
        };
    }
    if (status == 4){
        return {
            text:'已取消',
            type:'error'
        };
    }
     return {
        text:'待审批',
        type:'warning'
    };
}


const getState = (flow: DocViewModel)=>{
    const state:any = flow.state;
    if (state == 0 || !state){
        return {
            text:'待签字',
            type:'warning'
        };
    }
    if (state == 1){
        return {
            text:'待办理',
            type:'warning'
        };
    }
    if (state == 2){
        return {
            text:'完成',
            type:'success'
        };
    }
     return {
        text:'待签字',
        type:'warning'
    };
}

</script>