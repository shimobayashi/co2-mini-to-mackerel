# co2-mini-to-mackerel
CO2-miniで取得できる数値をMackerelへ投げるだけのスクリプト

## Installation

CO2-miniをつないだ状態で、以下の手順でとりあえず動かしてみると良さそう。

```
sudo apt-get update
sudo apt-get install libusb-dev # usbモジュールのビルドに必要だった
npm install
MACKEREL_API_KEY=XXX MACKEREL_SERVICE_NAME=home MACKEREL_METRIC_NAME_SUFFIX=bedroom sudo -E node index.js # sudoしないとUSBデバイスに触れなかった。udev ruleとかいうやつをがんばって書けば要らなくなるかも知れない
```

動いたら、systemdでデーモン化すると良さそう。

```
cp co2-mini-to-mackerel.service.example /etc/systemd/system/co2-mini-to-mackerel.service
vi /etc/systemd/system/co2-mini-to-mackerel.service # 自身の環境に合わせて書き換える
sudo systemctl enable co2-mini-to-mackerel
tail -f /var/log/syslog
```
