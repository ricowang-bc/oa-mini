<template>
	<view class="check">
		<view style="padding-bottom: 200rpx;">
			<view v-for="(item, index) in indexList" :key="index">
				<u-index-anchor :index="item" />
				<view class="list-cell" v-for="people in getUsers(item)">
					<u-checkbox :label-disabled="false" v-model="people.checked" :key="people.id"  :name="people.id">{{people.name}}</u-checkbox>
				</view>
			</view>
		</view>

		<view class="bottom-fix">
			<view class="u-flex row-end"  >
				<u-button @click="SaveDonners" type="primary" size="medium">确定</u-button>
			</view>
		</view>
	</view>
	
</template>

<script setup lang="ts">
import API from '@/api'
import type { UserViewModel } from '@/api/admin/gen/typings';
import { onShow } from '@dcloudio/uni-app';
import { computed, ref } from 'vue';
const user : UserViewModel = uni.getStorageSync("user") as UserViewModel;
const peoples = ref<any[]>([]);

onShow(async() => {
	await loadData();
});


// 根据peoples的第一个字组成的数组并去除掉重复内容并排序
const indexList = computed(() => {
	const set = new Set(peoples.value.map((item) => item.name? item.name[0]:'-'));
	let array = Array.from(set);
	
	// array 按汉字汉语拼音首字母排序
	array = array.sort((a, b) => {
		return a.localeCompare(b, 'zh-Hans-CN', { sensitivity: 'accent' });
	});
	return array;
	
});

const getUsers =(key:any)=>{
	return peoples.value.filter((item)=>{
		return item.name?item.name[0] === key:'-';
	});
}


const loadData =async () => {
	let res = await API.User.All();
	if (res){
		const donners = uni.getStorageSync("donners");
		peoples.value = [...res.filter(x=>x.departmentID == user.departmentID && x.id!= user.id)];
		peoples.value.forEach((item)=>{
			item.checked = donners.find((x:any)=>x.id == item.id)!=null;
		});
	}
}

const SaveDonners = () => {
	let res = peoples.value.filter((item)=>{
		return item.checked;
	});
	uni.setStorageSync("donners",res);
	const flow = uni.getStorageSync('check');
	uni.navigateTo({
        url: `/pages/check/index?id=${flow.id}&prefix=${flow.prefix}`,
    });
}

const onBackPress = (e:any) => {
	uni.showToast({
		title: '返回',
		icon: 'none'
	});
	console.log('123123');
}
</script>

<style lang="scss" scoped>
	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}
</style>